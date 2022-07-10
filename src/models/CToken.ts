import {getProviderStore} from "App"
import {svWBGLDelegatorContract} from "models/contracts/svWBGLDelegatorContract"
import {svBUSDDelegatorContract} from "models/contracts/svBUSDDelegatorContract"

export class Ctoken {
  cToken: any
  account: any
  isWBGL: boolean
  contract: any

  constructor(cToken: any, account: any, isWBGL: boolean) {
    this.cToken = cToken
    this.account = account
    this.contract = isWBGL ?
      svWBGLDelegatorContract(cToken, getProviderStore.currentProvider) :
      svBUSDDelegatorContract(cToken, getProviderStore.currentProvider)
  }

  supply = (value: any, gas?: any) => {
    const params: any = {from: this.account}
    const contractSig = this.contract.connect(getProviderStore.signer)
    // if (this.isEther) {
    //   params.value = value;
    //   params.gas = gas;
    //
    //   return contractSig.mint(params);
    // }
    return contractSig.mint(value, params)
  }

  getEstimateGas = (method: any, value: any) => {
    return this.contract[method]().estimateGas({from: this.account, value})
  }

  borrow = (value: any) => {
    const params: any = {from: this.account}
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.borrow(value, params)
  }

  repayBorrow = (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    // if (this.isEther) {
    //   return contractSig.repayBorrow().send({
    //     from: this.account,
    //     value,
    //   });
    // }
    return contractSig.repayBorrow(value).send({from: this.account})
  }

  withdraw = (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.redeemUnderlying(value).send({from: this.account})
  }

  supplyRatePerBlock = () => {
    return this.contract.supplyRatePerBlock()
  }

  borrowRatePerBlock = () => {
    return this.contract.borrowRatePerBlock()
  }

  getDecimals = () => {
    return this.contract.decimals()
  }

  approve = async (cToken: any, amount: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.approve(cToken, amount)
  }

  balanceOfUnderlying = () => {
    return this.contract.balanceOfUnderlying(this.account)
  }

  borrowBalanceCurrent = () => {
    return this.contract.borrowBalanceCurrent(this.account)
  }

  getExchangeRate = () => {
    return this.contract.exchangeRateStored()
  }

  getCash = () => {
    return this.contract.getCash()
  }

  getName = () => {
    return this.contract.name()
  }

  getTotalBorrows = () => {
    return this.contract.totalBorrows()
  }

  getTotalSupply = () => {
    return this.contract.totalSupply()
  }

  getExchangeRateStored = () => {
    return this.contract.exchangeRateStored()
  }

  estimateGas = (recipientAddress: any, amount: any) => {
    return this.contract.estimateGas.transfer(recipientAddress, amount)
  }
}
