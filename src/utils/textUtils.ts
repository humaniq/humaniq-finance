import {toChecksumAddress} from "ethereumjs-util"

export const capitalize = (str?: string | null) =>
  (str && str.charAt(0).toUpperCase() + str.slice(1)) || ""

export const toUpperCase = (str?: string | null) =>
  typeof str === "string" ? str.toUpperCase() : ""

export const toLowerCase = (str?: string | null) =>
  typeof str === "string" ? str.toLowerCase() : ""

export const isEmpty = (str?: string | null) =>
  typeof str === "string" ? str.trim() === "" : true

export const hexToDecimal = (str: string) => parseInt(str, 16)

export const renderShortAddress = (address?: string | null) => {
  if (!address) return address
  const checksummedAddress = toChecksumAddress(address)
  return checksummedAddress
    ? `${checksummedAddress.slice(0, 4)}...${checksummedAddress.substring(
      checksummedAddress.length - 4
    )}`
    : ""
}
