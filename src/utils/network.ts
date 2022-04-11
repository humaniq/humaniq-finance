export const isNotAuthorized = (code: number) => code === 401;
export const isNotAllowed = (code: number) => code === 403;
export const isOk = (code: number) => code >= 200 && code <= 202;

function toArray(val: string) {
  return Object.prototype.toString.call(val) !== "[object Array]" ? [val] : val;
}

export function formatRoute(routePath: string, params: any) {
  const reRepeatingSlashes = /\/+/g; // "/some//path"
  const reSplatParams = /\*{1,2}/g; // "/some/*/complex/**/path"
  const reResolvedOptionalParams = /\(([^:*?#]+?)\)/g; // "/path/with/(resolved/params)"
  const reUnresolvedOptionalParams = /\([^:?#]*:[^?#]*?\)/g; // "/path/with/(groups/containing/:unresolved/optional/:params)"
  const reUnresolvedOptionalParamsRR4 = /(\/[^/]*\?)/g; // "/path/with/groups/containing/unresolved?/optional/params?"
  const reTokens = /<(.*?)>/g;
  const reSlashTokens = /_!slash!_/g;

  let tokens: any = {};

  if (params) {
    for (let paramName in params) {
      if (params.hasOwnProperty(paramName)) {
        let paramValue = params[paramName];

        if (paramName === "splat") {
          // special param name in RR, used for "*" and "**" placeholders
          paramValue = toArray(paramValue); // when there are multiple globs, RR defines "splat" param as array.
          let i = 0;
          routePath = routePath.replace(reSplatParams, (match) => {
            let val = paramValue[i++];
            if (val == null) {
              return "";
            } else {
              let tokenName = `splat${i}`;
              tokens[tokenName] =
                match === "*"
                  ? encodeURIComponent(val)
                  : // don't escape slashes for double star, as "**" considered greedy by RR spec
                    encodeURIComponent(
                      val.toString().replace(/\//g, "_!slash!_")
                    ).replace(reSlashTokens, "/");
              return `<${tokenName}>`;
            }
          });
        } else {
          // Rougly resolve all named placeholders.
          // Cases:
          // - "/path/:param"
          // - "/path/(:param)"
          // - "/path(/:param)"
          // - "/path(/:param/):another_param"
          // - "/path/:param(/:another_param)"
          // - "/path(/:param/:another_param)"
          const paramRegex = new RegExp(
            "(/|\\(|\\)|^):" + paramName + "(/|\\)|\\(|$)"
          );
          routePath = routePath.replace(paramRegex, (match, g1, g2) => {
            tokens[paramName] = encodeURIComponent(paramValue);
            return `${g1}<${paramName}>${g2}`;
          });
          const paramRegexRR4 = new RegExp("(.*):" + paramName + "\\?(.*)");
          routePath = routePath.replace(paramRegexRR4, (match, g1, g2) => {
            tokens[paramName] = encodeURIComponent(paramValue);
            return `${g1}<${paramName}>${g2}`;
          });
        }
      }
    }
  }

  return (
    routePath
      // Remove braces around resolved optional params (i.e. "/path/(value)")
      .replace(reResolvedOptionalParams, "$1")
      // Remove all sequences containing at least one unresolved optional param
      .replace(reUnresolvedOptionalParams, "")
      // Remove all sequences containing at least one unresolved optional param in RR4
      .replace(reUnresolvedOptionalParamsRR4, "")
      // After everything related to RR syntax is removed, insert actual values
      .replace(reTokens, (match, token) => tokens[token])
      // Remove repeating slashes
      .replace(reRepeatingSlashes, "/")
      // Always remove ending slash for consistency
      .replace(/\/+$/, "")
      // If there was a single slash only, keep it
      .replace(/^$/, "/")
  );
}
