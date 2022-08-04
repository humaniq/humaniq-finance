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

export const round = (n: number, precision: number) => {
  const prec = Math.pow(10, precision);
  return Math.round(n * prec) / prec;
}

export const formatToCurrency = (n: any) => {
  return intlCurrency.format(n);
}

export const formatToNumber = (n: number) => {
  return intlSimple.format(n);
}

export const formatValue = (value: any, dec: number = 4, currency: string = '$') => {
  return `${currency}${Big(value).toFixed(Big(value).eq(0) ? 0 : dec)}`
}

export const beautifyNumber = (n: number, isCurrency: boolean) => {
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
