import {BigNumber} from "@ethersproject/bignumber"
import Big from "big.js"

export const noop = () => {
}

export const wait = (ms: number) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(true)
  }, ms)
})

export const MAX_UINT_256 = BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
)

export const NUMBER_INPUT = /^0$|^[1-90]\d{0,16}$|^(?=[1-90]\d*[.]\d*$).{1,16}$|^(?=0[.]\d*$).{1,16}|^(?=[.]\d*$).{1,16}$/gm

export const DIGITS_INPUT = /^([0-9]+)?(\.)?([0-9]+)?$/

export const NUMBER = /^[1-9]\d{0,16}$|^(?=[1-9]\d*[.]\d+$).{1,16}$|^(?=0[.](\d+)?[1-9]$).{1,16}$/

export const cutString = (str?: string | null | undefined) => {
  if (typeof str !== 'string') {
    return ''
  }

  return str.substring(0, 16)
}

export const convertValue = (value: any, tokenDecimals = 18) => {
  if (value === undefined || value === null) return '0'

  return Big(value)
    .times(Big(10).pow(tokenDecimals))
    .toFixed();
}
