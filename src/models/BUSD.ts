import {BUSDTestContract} from "models/contracts/BUSDTestContract"

export class BUSD {
  account: any
  provider: any
  contract: any

  constructor(provider: any, account: any) {
    this.account = account
    this.provider = provider
    this.contract = BUSDTestContract(this.provider)
  }

  allowance = async (cToken: any) => {
    return this.contract.allowance(this.account, cToken)
  }

  approve = async (cToken: any, amount: any) => {
    return this.contract.allowance(cToken, amount)
  }
}
