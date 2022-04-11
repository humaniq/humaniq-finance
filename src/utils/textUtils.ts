export const capitalize = (str?: string) =>
  (str && str.charAt(0).toUpperCase() + str.slice(1)) || false;

export const toUpperCase = (str?: string) =>
  typeof str === "string" ? str.toUpperCase() : "";

export const toLowerCase = (str?: string) =>
  typeof str === "string" ? str.toLowerCase() : "";

export const isEmpty = (str?: string) =>
  typeof str === "string" ? str.trim() === "" : true;
