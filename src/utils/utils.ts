import Big from "big.js"

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

function round(n: number, precision: number) {
  const prec = Math.pow(10, precision);
  return Math.round(n * prec) / prec;
}

export function formatToCurrency(n: any) {
  return intlCurrency.format(n);
}

export function formatToNumber(n: number) {
  return intlSimple.format(n);
}

export function preciseRound(n: any) {
  return parseFloat(
    n.toExponential(~~Math.max(1, 2 + Math.log10(Math.abs(n))))
  );
}

export function formatBalance(value: any) {
  let v = Big(value)
  return v.gte(1) ? parseFloat(v.toFixed(4)) : preciseRound(v);
}

export function beautifyNumber(n: number, isCurrency: boolean) {
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

export function upperFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toCamelCase(value: string) {
  return value
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}