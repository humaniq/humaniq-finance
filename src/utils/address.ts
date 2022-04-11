import { toChecksumAddress } from "ethereumjs-util";

/**
 * Returns short address format
 *
 * @param {String} address - String corresponding to an address
 * @param {Number} chars - Number of characters to show at the end and beginning.
 * Defaults to 4.
 * @returns {String} - String corresponding to short address format
 */
export function renderShortAddress(address: string, chars = 4) {
  if (!address) return address;
  const checksummedAddress = toChecksumAddress(address);
  // return `${checksummedAddress.substr(0, chars + 2)}...${checksummedAddress.substr(-chars)}`;
  return checksummedAddress
    ? `${checksummedAddress.slice(0, 4)}...${checksummedAddress.substring(
        checksummedAddress.length - 4
      )}`
    : "";
}
