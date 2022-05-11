import {makeAutoObservable} from "mobx"
import {URLS} from "constants/api"
import {Comptroller} from "models/Comptroller"
import {CompoundLens} from "models/CompoundLens"
import {Ctoken} from "models/CToken"
import {isEther} from "models/ContractsAPI"
import {Token} from "models/Token"
import Big from "big.js"
import {getProviderStore} from "App"
import {renderShortAddress} from "utils/address"
import {t} from "i18next"
import {BorrowSupplyItem} from "models/types"

export class HomeViewModel {
  supplyMarket: BorrowSupplyItem[] = []
  userSuppliedMarket: BorrowSupplyItem[] = []
  borrowMarket: BorrowSupplyItem[] = []
  userBorrowedMarket: BorrowSupplyItem[] = []
  cl: any = null
  ethMantissa = 1e18
  blocksPerDay = 4 * 60 * 24
  daysPerYear = 365
  unclaimedRewards = 0
  ersdlBalance = 0
  comptroller: any = null
  cTokenAddressList: string[] = []
  ethAccount?: string | null = null
  market = []
  isRefreshing = true
  networkId = 4
  chainId = 4
  ersdlPrice = 0
  totalBorrow = 0
  totalSupply = 0
  borrowLimit = 0
  liquidity = 0
  netApy = 0
  tokensGeneratingRewards: any
  modalVisible = false

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
    this.networkId = getProviderStore.networkId
    this.chainId = getProviderStore.chainId
    this.ethAccount = getProviderStore.currentAccount
  }

  get isUserMarketShown() {
    return this.userSuppliedMarket.length || this.userBorrowedMarket.length
  }

  get getAvailableLimit() {
    return this.borrowLimit - this.totalBorrow
  }

  get getBorrowLimitPercentage() {
    const limit = (this.totalBorrow / this.borrowLimit) * 100
    return parseFloat(limit.toFixed(2))
  }

  get getAccount() {
    return renderShortAddress(this.ethAccount) || t("wallet.notConnected")
  }

  get getNetApy() {
    return this.netApy
  }

  get getBorrowBalance() {
    return `$${this.totalBorrow.toFixed(2)}`
  }

  get getSupplyBalance() {
    return `$${this.totalSupply.toFixed(2)}`
  }

  get isConnectionSupport() {
    return (
      URLS.NETWORK_ID === this.networkId && URLS.CHAIN_ID === this.chainId
    )
  }

  get getBorrowLimit() {
    return `${this.borrowLimit.toFixed(2)}$`
  }

  setModalVisible = (visible: boolean) => {
    this.modalVisible = visible
  }

  calculateAPY = (ratePerBlock: any) => {
    // todo: ethMantissa for everything or not
    const apy =
      (Math.pow(
          (ratePerBlock / this.ethMantissa) * this.blocksPerDay + 1,
          this.daysPerYear
        ) -
        1) *
      100

    return +apy.toFixed(2)
  }

  calculateTotals = (market: any) => {
    const totalSupply = market.reduce(
      (acc: any, current: any) => acc + current.fiatSupply,
      0
    )

    const totalBorrow = market.reduce(
      (acc: any, current: any) => acc + current.fiatBorrow,
      0
    )

    const totalEarning = market.reduce(
      (acc: any, current: any) =>
        current.supplyBalance == 0
          ? acc
          : acc + (current.fiatSupply * current.supplyApy) / 100,
      0
    )

    const totalSpending = market.reduce(
      (acc: any, current: any) =>
        current.borrowBalance == 0
          ? acc
          : acc + (current.fiatBorrow * current.borrowApy) / 100,
      0
    )

    let netApy =
      totalSupply === 0
        ? 0
        : ((totalEarning - totalSpending) * 100) / totalSupply
    netApy = Math.round((netApy + Number.EPSILON) * 100) / 100

    this.totalBorrow = totalBorrow
    this.totalSupply = totalSupply
    this.netApy = netApy
  }

  mergeTokenData = async (
    balances: any,
    prices: any,
    metadata: any,
    totalEarned: any
  ) => {
    return metadata.map(async (data: any) => {
      const isEth = await isEther(data.cToken)
      const price = prices.find((p: any) => p.cToken === data.cToken)
      const balance = balances.find((b: any) => b.cToken === data.cToken)
      const cTokenContract = new Ctoken(data.cToken, this.ethAccount, isEth)
      const cTokenData = Object.assign({}, data)

      let token: any = null

      if (!isEth) {
        cTokenData.token = data.underlyingAssetAddress
        token = new Token(cTokenData.token)
        cTokenData.symbol = await token.getSymbol()
        cTokenData.name = await token.getName()
      } else {
        // For eth cToken = tokenun
        cTokenData.token = data.cToken
        cTokenData.symbol = "ETH"
        cTokenData.name = "ETH"
      }

      cTokenData.cName = await cTokenContract.getName()
      cTokenData.totalBorrows = await cTokenContract.getTotalBorrows()
      cTokenData.totalSupply = await cTokenContract.getTotalSupply()
      cTokenData.exchangeRateStored =
        await cTokenContract.getExchangeRateStored()
      cTokenData.liquidity = await cTokenContract.getCash()

      cTokenData.isEnteredTheMarket = await this.comptroller.checkMembership(
        data.cToken
      )

      cTokenData.supplyAllowed = true
      cTokenData.borrowAllowed = true

      // cTokenData.supplyAllowed = !(await this.comptroller.mintGuardianPaused(
      //   data.cToken
      // ));// TODO check what's the problem
      // cTokenData.borrowAllowed = !(await this.comptroller.borrowGuardianPaused(
      //   data.cToken
      // )); // TODO check what's the problem

      cTokenData.underlyingPrice = price.underlyingPrice
      cTokenData.tokenBalance = balance.tokenBalance
      cTokenData.tokenAllowance = balance.tokenAllowance
      cTokenData.borrowBalance = balance.borrowBalanceCurrent
      cTokenData.supplyBalance = balance.balanceOfUnderlying
      cTokenData.balanceOf = balance.balanceOf
      cTokenData.earnedUsd = totalEarned?.usd[data.cToken] || 400 // TODO 0 default
      cTokenData.earnedUnderlying = totalEarned?.underlying[data.cToken] || 400 // TODO 0 default

      return cTokenData
    })
  }

  convertFrom = (value: any, decimalValue: any) => {
    return Big(value).div(decimalValue)
  }

  convertValues = (item: any) => {
    const decimalValue = Big(10).pow(+item.underlyingDecimals)

    item.balance = this.convertFrom(item.tokenBalance, decimalValue)
    item.supply = this.convertFrom(item.supplyBalance, decimalValue)
    item.borrow = this.convertFrom(item.borrowBalance, decimalValue)

    item.supplyApy = this.calculateAPY(item.supplyRatePerBlock)
    item.borrowApy = this.calculateAPY(item.borrowRatePerBlock)

    item.liquidity = this.convertToUSD(
      item.liquidity,
      item.underlyingPrice,
      item.underlyingDecimals
    )
    item.tokenUsdValue = this.convertToUSD(
      Math.pow(10, item.underlyingDecimals),
      item.underlyingPrice,
      item.underlyingDecimals
    )

    item.fiatSupply =
      item.underlyingPrice == 0
        ? 0
        : this.convertToUSD(
          item.supplyBalance,
          item.underlyingPrice,
          item.underlyingDecimals
        )

    item.fiatBorrow =
      item.underlyingPrice == 0
        ? 0
        : this.convertToUSD(
          item.borrowBalance,
          item.underlyingPrice,
          item.underlyingDecimals
        )
  }

  convertToUSD = (value: any, underlyingPrice: any, tokenDecimals: any) => {
    const oracleMantissa = Big(10).pow(18)
    const decimalValue = Big(10).pow(+tokenDecimals)
    const mantisa = Big(10).pow(18 - tokenDecimals)

    const usdValue = Big(value)
      .times(underlyingPrice)
      .div(decimalValue)
      .div(oracleMantissa)
      .div(mantisa)

    return usdValue.toNumber()
  }

  getTokenData = async (cToken: any) => {
    return await this.cl.getcTokenData(cToken)
  }

  setRewardsInfo = async () => {
    const ersdl: any = this.market.find(
      (token: any) => token.symbol === "eRSDL"
    )
    const balance = await this.cl.getCompoundBalance(ersdl.token)

    this.ersdlPrice = ersdl.underlyingPrice
    this.unclaimedRewards = balance.allocated / this.ethMantissa
    this.ersdlBalance = balance.balance / this.ethMantissa
  }

  calculateDistributionApy = async (item: any) => {
    const compSpeeds = await this.comptroller.getCompSpeeds(item.cToken)
    const tmp = compSpeeds * 100 * 4 * 60 * 24 * 365 * this.ersdlPrice

    const supplyDistributionApy = +item.totalSupply
      ? (tmp * this.ethMantissa) /
      (item.totalSupply * item.exchangeRateStored * item.underlyingPrice)
      : 0
    item.supplyDistributionApy = !supplyDistributionApy
      ? 0
      : supplyDistributionApy

    const borrowDistributionApy = +item.totalBorrows
      ? tmp / (item.totalBorrows * item.underlyingPrice)
      : 0
    item.borrowDistributionApy = !borrowDistributionApy
      ? 0
      : borrowDistributionApy
  }

  init = async () => {
    if (!this.isConnectionSupport) {
      this.setLoader(false)
      return
    }

    if (!this.isRefreshing) {
      this.setLoader(true)
    }

    this.cTokenAddressList = await this.comptroller.getAllMarkets()
    const cTokensBalances = await this.cl.getBalanceAll(this.cTokenAddressList)
    const underlyingPrices = await this.cl.getUnderlyingPriceAll(
      this.cTokenAddressList
    )
    // const totalEarned = await getTotalEarned(this.ethAccount) // TODO error from backend
    const cTokensDataTasks = this.cTokenAddressList.map(this.getTokenData)
    const cTokensDataResults = await Promise.all(cTokensDataTasks)

    let market = await this.mergeTokenData(
      cTokensBalances,
      underlyingPrices,
      cTokensDataResults,
      null
    )

    market = await Promise.all(market)
    market.forEach(this.convertValues)

    this.market = market

    await this.setRewardsInfo()

    const apyPromises = market.map(this.calculateDistributionApy)
    await Promise.all(apyPromises)

    this.calculateTotals(market)

    let {1: liquidity} = await this.comptroller.getAccountLiquidity()
    liquidity = liquidity / 1e18

    this.borrowLimit = liquidity + this.totalBorrow
    this.liquidity = liquidity

    market = market.sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))

    this.supplyMarket = market.filter(
      (market: any) => market.supplyAllowed && market.supplyBalance == 0
    )

    this.userSuppliedMarket = market.filter(
      (market: any) => market.supplyBalance > 0
    )

    this.borrowMarket = market.filter(
      (market: any) => market.borrowAllowed && market.borrowBalance == 0
    )

    this.userBorrowedMarket = market.filter(
      (market: any) => market.borrowBalance > 0
    )

    this.tokensGeneratingRewards = market
      .filter(
        (market: any) =>
          (market.supplyBalance > 0 && market.supplyDistributionApy > 0) ||
          (market.borrowBalance > 0 && market.borrowDistributionApy > 0)
      )
      .map((market: any) => market.cToken)

    this.setLoader(false)
  }

  setLoader = (state: boolean) => {
    this.isRefreshing = state
  }

  mounted = async () => {
    if (this.ethAccount) {
      this.setLoader(true)
      this.comptroller = new Comptroller(this.ethAccount)
      this.cl = new CompoundLens(this.ethAccount)
      await this.init()
      this.setLoader(false)
    }
  }
}