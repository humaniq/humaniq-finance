import CONFIG from "@/config/env";

const pow = Math.pow,
  floor = Math.floor,
  abs = Math.abs,
  log = Math.log;
const abbrev = "KMB";

const formatOptions = {
  style: "currency",
  currency: "USD",
};

const intlCurrency = Intl.NumberFormat("en-US", formatOptions);
const intlSimple = Intl.NumberFormat();

function round(n, precision) {
  const prec = Math.pow(10, precision);
  return Math.round(n * prec) / prec;
}

export function formatToCurrency(number) {
  return intlCurrency.format(number);
}

export function formatToNumber(number) {
  return intlSimple.format(number);
}

export function preciseRound(n) {
  return parseFloat(
    n.toExponential(~~Math.max(1, 2 + Math.log10(Math.abs(n))))
  );
}

export function formatBalance(value) {
  return value.gte(1) ? parseFloat(value.toFixed(4)) : preciseRound(value);
}

export function beautifyNumber(n, isCurrency) {
  let base = floor(log(abs(n)) / log(1000));
  const suffix = abbrev[Math.min(2, base - 1)];
  base = abbrev.indexOf(suffix) + 1;
  const rounded = round(n / pow(1000, base), 2);

  return isCurrency
    ? suffix
      ? formatToCurrency(rounded) + suffix
      : formatToCurrency(n)
    : suffix
    ? rounded + suffix
    : n;
}

export function upperFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export const allEnvSettled = !Object.values(CONFIG).some(
  (i) => i === undefined
);
