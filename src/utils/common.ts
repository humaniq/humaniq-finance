import {BigNumber} from "@ethersproject/bignumber"
import Big from "big.js"

export const noop = () => {
}

export const wait = (ms: number) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(true)
  }, ms)
})

export const MIN_VALUE = 0.01

export const MAX_UINT_256 = BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
)

export const NUMBER_INPUT = /^0$|^[1-90]\d{0,16}$|^(?=[1-90]\d*[.]\d*$).{1,16}$|^(?=0[.]\d*$).{1,16}|^(?=[.]\d*$).{1,16}$/gm

export const DIGITS_INPUT = /^([0-9]+)?(\.)?([0-9]+)?$/

export const LEADING_ZERO = /^0[0-9].*$/

export const NUMBER = /^[1-9]\d{0,16}$|^(?=[1-9]\d*[.]\d+$).{1,16}$|^(?=0[.](\d+)?[1-9]$).{1,16}$/

export const cleanDust = (str?: string | null) => {
  if (typeof str !== 'string' || !str) {
    return ''
  }

  return str.split(".")[0]
}

export const cutString = (str?: string | null, end: number = 16) => {
  if (typeof str !== 'string' || !str) {
    return ''
  }

  return str.substring(0, end)
}

export const convertValue = (value?: string | null | undefined, tokenDecimals = 18) => {
  if (value === undefined || value === null) return '0'

  return Big(value)
    .times(Big(10).pow(tokenDecimals))
    .toFixed();
}
