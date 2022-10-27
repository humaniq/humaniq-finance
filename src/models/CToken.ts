import {getProviderStore} from "App"
import {svWBGLDelegatorContract} from "models/contracts/svWBGLDelegatorContract"
import {svBUSDDelegatorContract} from "models/contracts/svBUSDDelegatorContract"
import {WBGL} from "models/WBGL"
import {BUSD} from "models/BUSD"

export class Ctoken {
  cToken: any
  account: any
  isWBGL: boolean
  contract: any
  token: WBGL | BUSD

  constructor(cToken: any, account: any, isWBGL: boolean) {
    this.cToken = cToken
    this.account = account
    this.contract = isWBGL ?
      svWBGLDelegatorContract(cToken, getProviderStore.currentProvider) :
      svBUSDDelegatorContract(cToken, getProviderStore.currentProvider)
    this.token = isWBGL ?
      new WBGL(getProviderStore.currentProvider, getProviderStore.currentAccount) :
      new BUSD(getProviderStore.currentProvider, getProviderStore.currentAccount)
  }

  supply = async (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.mint(value, {from: this.account})
  }

  getEstimateGas = async (method: any, value: any) => {
    return this.contract[method]().estimateGas({from: this.account, value})
  }

  borrow = async (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.borrow(value, {from: this.account})
  }

  repayBorrow = async (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.repayBorrow(value, {from: this.account})
  }

  withdraw = (value: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.redeemUnderlying(value, {from: this.account})
  }

  supplyRatePerBlock = () => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.supplyRatePerBlock()
  }

  borrowRatePerBlock = () => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.borrowRatePerBlock()
  }

  getDecimals = () => {
    return this.contract.decimals()
  }

  approve = async (cToken: any, amount: any) => {
    const contractSig = this.contract.connect(getProviderStore.signer)
    return contractSig.approve(cToken, amount)
  }

  balanceOfUnderlying = () => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.balanceOfUnderlying(this.account)
  }

  borrowBalanceCurrent = () => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.borrowBalanceCurrent(this.account)
  }

  getExchangeRate = () => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.exchangeRateStored()
  }

  getCash = () => {
    return this.contract.getCash()
  }

  getName = () => {
    return this.contract.name()
  }

  getTotalBorrows = () => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.totalBorrows()
  }

  getTotalSupply = () => {
    const contractSig = this.contract.connect(getProviderStore.currentProvider)
    return contractSig.totalSupply()
  }

  getExchangeRateStored = () => {
    return this.contract.exchangeRateStored()
  }

  estimateGas = (recipientAddress: any, method: string, amount: any) => {
    return this.contract.estimateGas[method](amount, {from: this.account})
  }

  getTokenBalance = () => {
    return this.token.balanceOf()
  }
}
