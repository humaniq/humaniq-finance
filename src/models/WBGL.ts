import {WBGLTestContract} from "models/contracts/WBGLTestContract"
import {MAX_UINT_256} from "utils/common"

export class WBGL {
  account?: string | null
  provider: any
  contract: any

  constructor(provider: any, account?: string | null) {
    this.account = account
    this.provider = provider
    this.contract = WBGLTestContract(this.provider)
  }

  balanceOf = async () => {
    return this.contract.balanceOf(this.account)
  }

  allowance = async (cToken: any) => {
    return this.contract.allowance(this.account, cToken, {from: this.account})
  }

  approve = async (cToken: any) => {
    return this.contract.approve(cToken, MAX_UINT_256, {from: this.account})
  }
}
