import {BUSDTestContract} from "models/contracts/BUSDTestContract"
import {MAX_UINT_256} from "models/constants/constants"

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
    return this.contract.allowance(this.account, cToken, {from: this.account})
  }

  approve = async (cToken: any) => {
    return this.contract.approve(cToken, MAX_UINT_256, {from: this.account})
  }
}
