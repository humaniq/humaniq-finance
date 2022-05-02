import { BigNumber } from "@ethersproject/bignumber";

export const MAX_UINT_256 = BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export const REG = {
  NUMBER_INPUT:
    /^0$|^[1-90]\d{0,16}$|^(?=[1-90]\d*[.]\d*$).{1,16}$|^(?=0[.]\d*$).{1,16}|^(?=[.]\d*$).{1,16}$/gm,
  NUMBER:
    /^[1-9]\d{0,16}$|^(?=[1-9]\d*[.]\d+$).{1,16}$|^(?=0[.](\d+)?[1-9]$).{1,16}$/,
};
