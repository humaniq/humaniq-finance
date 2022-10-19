import { makeAutoObservable } from "mobx"
import { Comptroller } from "models/Comptroller"
import { CompoundLens } from "models/CompoundLens"
import { Ctoken } from "models/CToken"
import { Token } from "models/Token"
import Big from "big.js"
import { getProviderStore } from "App"
import { t } from "i18next"
import { BorrowSupplyItem } from "models/types"
import { formatValue } from "utils/utils"
import { renderShortAddress } from "utils/textUtils"
import { MIN_VALUE } from "utils/common"

export class HomeViewModel {
  userSuppliedMarket: BorrowSupplyItem[] = []
  userBalanceMarket: BorrowSupplyItem[] = []
  borrowMarket: BorrowSupplyItem[] = []
  userBorrowedMarket: BorrowSupplyItem[] = []
  cl: any = null
  ethMantissa = 1e18
  blocksPerDay = 4 * 60 * 24
  daysPerYear = 365
  comptroller: any = null
  cTokenAddressList: string[] = []
  market = []
  isRefreshing = true
  totalBorrow = 0
  totalSupply = 0
  borrowLimit = 0
  liquidity = 0
  netApy = 0
  liquidityModalVisible = false

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true })
  }

  get getAvailableLimit() {
    return this.borrowLimit - this.totalBorrow
  }

  get getBorrowLimitPercentage() {
    if (this.totalBorrow === 0 || this.borrowLimit === 0) return 0

    return (this.totalBorrow / this.borrowLimit) * 100
  }

  get getAccount() {
    return getProviderStore.currentAccount ? renderShortAddress(getProviderStore.currentAccount) : t("wallet.connectWalletDialog")
  }

  get getNetApy() {
    return this.netApy
  }

  get getNetApyLabel() {
    if (!this.netApy || (Big(this.totalSupply).lte(MIN_VALUE) && Big(this.totalBorrow).lte(MIN_VALUE))) return "..."

    return Big(this.netApy).toFixed(2)
  }

  get getBorrowBalance() {
    return `$${Big(this.totalBorrow).toFixed(Big(this.totalBorrow).lte(MIN_VALUE) ? 0 : 4)}`
  }

  get getSupplyBalance() {
    return `$${Big(this.totalSupply).toFixed(Big(this.totalSupply).lte(MIN_VALUE) ? 0 : 4)}`
  }

  get isConnectionSupported() {
    return getProviderStore.isConnectionSupported
  }

  get getBorrowLimit() {
    return `${this.borrowLimit.toFixed(Big(this.borrowLimit).lte(MIN_VALUE) ? 0 : 2)}$`
  }

  get hasCollateral() {
    return this.totalSupply > 0
  }

  toggleDialogOrDisconnectWallet = () => {
    if (!getProviderStore.currentAccount) {
      getProviderStore.connectDialog = !getProviderStore.connectDialog
    } else {
      getProviderStore.toggleDisconnectDialog()
    }
  }

  calculateAPY = (ratePerBlock: any) => {
    const apy =
      (Math.pow(
        (ratePerBlock / this.ethMantissa) * this.blocksPerDay + 1,
        this.daysPerYear) - 1) * 100

    return +apy.toFixed(2)
  }

  calculateTotals = (market: any) => {
    const totalSupply = market.reduce(
      (acc: any, current: any) => acc + (+current.fiatSupply),
      0
    )

    const totalBorrow = market.reduce(
      (acc: any, current: any) => acc + (+current.fiatBorrow),
      0
    )

    const totalEarning = market.reduce(
      (acc: any, current: any) =>
        +current.supplyBalance === 0
          ? acc
          : acc + (+current.fiatSupply * +current.supplyApy) / 100,
      0
    )

    const totalSpending = market.reduce(
      (acc: any, current: any) =>
        +current.borrowBalance === 0
          ? acc
          : acc + (+current.fiatBorrow * +current.borrowApy) / 100,
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
    metadata: any
  ) => {
    return metadata.map(async (data: any) => {
      const price = prices.find((p: any) => p.cToken === data.cToken)
      const balance = balances.find((b: any) => b.cToken === data.cToken)
      const cTokenData = Object.assign({}, data)

      let token: any

      cTokenData.token = data.underlyingAssetAddress
      token = new Token(cTokenData.token)

      const [symbol, name] = await Promise.all([
        token.getSymbol(),
        token.getName()
      ])

      const cTokenContract = new Ctoken(data.cToken, getProviderStore.currentAccount, symbol === getProviderStore.currentNetwork.WBGLSymbol)

      const [
        cName,
        totalBorrows,
        totalSupply,
        cash,
        checkMembership,
        mintGuardian,
        borrowGuardian
      ] = await Promise.all([
        cTokenContract.getName(),
        cTokenContract.getTotalBorrows(),
        cTokenContract.getTotalSupply(),
        cTokenContract.getCash(),
        this.comptroller.checkMembership(data.cToken),
        this.comptroller.mintGuardianPaused(data.cToken),
        this.comptroller.borrowGuardianPaused(data.cToken)
      ])

      cTokenData.symbol = symbol
      cTokenData.name = name
      cTokenData.cName = cName
      cTokenData.totalBorrows = totalBorrows
      cTokenData.totalSupply = totalSupply
      cTokenData.liquidity = cash
      cTokenData.isEnteredTheMarket = checkMembership
      cTokenData.supplyAllowed = !mintGuardian
      cTokenData.borrowAllowed = !borrowGuardian
      cTokenData.underlyingPrice = price.underlyingPrice
      cTokenData.tokenBalance = balance.tokenBalance
      cTokenData.tokenAllowance = balance.tokenAllowance
      cTokenData.borrowBalance = balance.borrowBalanceCurrent
      cTokenData.supplyBalance = balance.balanceOfUnderlying
      cTokenData.balanceOf = balance.balanceOf

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
      Math.pow(10, +item.underlyingDecimals),
      item.underlyingPrice,
      item.underlyingDecimals
    )

    item.fiatBalance =
      item.underlyingPrice === 0
        ? 0
        : this.convertToUSD(
          item.balance,
          item.underlyingPrice,
          item.underlyingDecimals
        )

    item.fiatSupply =
      item.underlyingPrice === 0
        ? 0
        : this.convertToUSD(
          item.supplyBalance,
          item.underlyingPrice,
          item.underlyingDecimals
        )

    item.fiatBorrow =
      item.underlyingPrice === 0
        ? 0
        : this.convertToUSD(
          item.borrowBalance,
          item.underlyingPrice,
          item.underlyingDecimals
        )
  }

  convertToUSD = (value: any, underlyingPrice: any, tokenDecimals: any) => {
    let oracleMantissa = Big(10).pow(18)
    const decimalValue = Big(10).pow(+tokenDecimals)
    const mantissa = Big(10).pow(18 - (+tokenDecimals))

    const usdValue = Big(value)
      .times(underlyingPrice)
      .div(decimalValue)
      .div(oracleMantissa)
      .div(mantissa)

    return usdValue.toNumber()
  }

  getTokenData = async (cToken: any) => {
    return await this.cl.getcTokenData(cToken)
  }

  init = async () => {
    if (!this.isConnectionSupported) {
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
    const cTokensDataTasks = this.cTokenAddressList.map(this.getTokenData)
    const cTokensDataResults = await Promise.all(cTokensDataTasks)

    let market = await this.mergeTokenData(
      cTokensBalances,
      underlyingPrices,
      cTokensDataResults
    )

    market = await Promise.all(market)
    market.forEach(this.convertValues)

    this.market = market

    this.calculateTotals(market)

    let { 1: liquidity } = await this.comptroller.getAccountLiquidity()
    liquidity = liquidity / 1e18

    this.borrowLimit = liquidity + this.totalBorrow
    this.liquidity = liquidity

    market = market
      .sort((a: any, b: any) => a.symbol.localeCompare(b.symbol))

    this.userBalanceMarket = market

    this.userSuppliedMarket = market.filter(
      (market: any) => Big(market.supply).mul(market.tokenUsdValue).gt(MIN_VALUE)
    )

    this.borrowMarket = market

    this.userBorrowedMarket = market.filter(
      (market: any) => Big(market.borrow).mul(market.tokenUsdValue).gt(MIN_VALUE)
    )
    this.setLoader(false)
  }

  setLoader = (state: boolean) => {
    this.isRefreshing = state
  }

  setLiquidityModalVisibility = (visibility: boolean) => {
    this.liquidityModalVisible = visibility
  }

  mounted = async () => {
    if (getProviderStore.currentAccount) {
      this.setLoader(true)
      this.comptroller = new Comptroller(getProviderStore.currentAccount)
      this.cl = new CompoundLens(getProviderStore.currentAccount)
      await this.init()
    } else {
      // clear
      this.market = []
      this.cTokenAddressList = []
      this.userSuppliedMarket = []
      this.userBalanceMarket = []
      this.borrowMarket = []
      this.userBorrowedMarket = []
      this.totalBorrow = 0
      this.totalSupply = 0
      this.borrowLimit = 0
      this.liquidity = 0
      this.netApy = 0
      this.comptroller = null
      this.cl = null
    }
    this.setLoader(false)
  }
}
