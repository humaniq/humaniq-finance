import {WBGLTestContract} from "models/contracts/WBGLTestContract"

export class WBGL {
  account: any
  provider: any
  contract: any

  constructor(provider: any, account: any) {
    this.account = account
    this.provider = provider
    this.contract = WBGLTestContract(this.provider)
  }

  allowance = async (cToken: any) => {
    return this.contract.allowance(this.account, cToken)
  }

  approve = async (cToken: any, amount: any) => {
    return this.contract.approve(cToken, amount)
  }
}
