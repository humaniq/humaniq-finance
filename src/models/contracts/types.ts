import {BigNumber} from "@ethersproject/bignumber"

export type tCompoundLensContract = {
  [key: number]: string;
  allocated: string;
  balance: string;
}

export type tAccountLiquidity = {
  [key: number]: string;
}

export type ProviderMessage = {
  type: string;
  message: unknown;
}

export type ConnectInfo = {
  chainId: string;
}

export type GasFeeResponse = {
  status: string
  message: string
  result: GasFee
}

export type GasFee = {
  LastBlock: string
  SafeGasPrice: string
  ProposeGasPrice: string
  FastGasPrice: string
  suggestBaseFee: BigNumber
  gasUsedRatio: BigNumber
}

export type GasFeeData = {
  gasPrice: BigNumber
  maxFeePerGas: BigNumber
  maxPriorityFeePerGas: BigNumber
}

export enum TRANSACTION_TYPE {
  DEPOSIT = "deposit",
  BORROW = "borrow",
  WITHDRAW = "withdraw",
  REPAY = "repay"
}
