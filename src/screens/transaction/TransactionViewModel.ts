import {makeAutoObservable} from "mobx"
import {BorrowSupplyItem, CoinCostResponse} from "models/types"
import {t} from "translations/translate"
import {Logger} from "utils/logger"
import Big from "big.js"
import {formatBalance, formatToCurrency, formatToNumber} from "utils/utils"
import {utils} from "ethers"
import {TransactionState} from "screens/transaction/Transaction"
import {isEmpty} from "utils/textUtils"
import {Token} from "models/Token"
import {getProviderStore} from "App"
import {isEther} from "models/ContractsAPI"
import {Comptroller} from "models/Comptroller"
import {Ctoken} from "models/CToken"
import {FaucetToken} from "models/FaucetToken"
import {ApiService} from "services/apiService/apiService"
import {COINGECKO_API_URL, COINGECKO_ROUTES} from "constants/network"

export class TransactionViewModel {
  item: BorrowSupplyItem = {} as any
  isRefreshing = true
  isDeposit = false
  borrowLimit = 0
  totalBorrow = 0
  inputValue = ""
  isSwap = false
  tokenContract: any
  comptroller: any
  ethAccount?: string | null = null
  cTokenContract: Ctoken
  faucetContract: any
  gasEstimating = false
  txPrice: any = 0

  gasPrice: any = Big(0)
  gasLimit: any = 21000

  fastGas: any = 0
  fastestGas: any = 0
  safeLowGas: any = 0

  showTransactionFeeModal = false
  nativeCoinPrice = 0

  protected readonly api: ApiService

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
    this.ethAccount = getProviderStore.currentAccount
    this.api = new ApiService()
    this.api.init(COINGECKO_API_URL)
  }

  get isEnoughBalance() {
    return this.isSwap ? this.balance.mul(this.item.tokenUsdValue).gte(+this.getInputValue) : this.balance.gte(+this.getInputValue)
  }

  get getInputFontSize() {
    return this.getInputValue.length < 8
      ? "50px"
      : "32px"
  }

  get getTokenSymbol() {
    return this.item.symbol
  }

  get balance() {
    return this.item.balance
  }

  get getFormattedBalance() {
    return `${formatBalance(this.balance)} ${this.getTokenSymbol}`
  }

  get getTitle() {
    return `${t(this.isDeposit ? "home.deposit" : "home.borrow")} ${this.getTokenSymbol}`
  }

  get getTokenBalance() {
    return `${this.balance.toFixed(4)}`
  }

  get getTokenUsdValue() {
    return formatToCurrency(parseFloat(this.item.tokenUsdValue).toFixed(4))
  }

  get getApyTitle() {
    return `${t(this.isDeposit ? "home.deposit" : "home.borrow")} ${t("home.netApy")}`
  }

  get getApyValue() {
    return `${this.isDeposit ? this.item.supplyApy : this.item.borrowApy}%`
  }

  get getBorrowLimitTitle() {
    return `${t(this.isDeposit ? "home.borrowLimit" : "transaction.borrowBalance")}`
  }

  get getBorrowLimitValue() {
    return formatToCurrency(this.isDeposit ? this.borrowLimit : this.totalBorrow)
  }

  get getBorrowLimitUsed() {
    return `${formatToNumber(this.borrowLimitUsed)}%`
  }

  get borrowLimitUsed() {
    if (this.borrowLimit) {
      const limit = (this.totalBorrow / this.borrowLimit) * 100
      return parseFloat(limit.toFixed(2))
    }

    return 0
  }

  get isEther() {
    return this.item.symbol === "ETH"
  }

  get getInputValue() {
    return this.inputValue
  }

  get newBorrowLimit() {
    if (!this.getInputValue) return 0
    if (!this.item.isEnteredTheMarket) return this.borrowLimit

    // @ts-ignore
    return this.borrowLimit + (this.isSwap ? this.inputValueToken : this.inputValueFiat) * this.collateralMantissa
  }

  get collateralMantissa() {
    return this.item.collateralFactorMantissa / 1e18
  }

  get inputValueFiat() {
    if (!this.getInputValue) return 0

    return Big(this.getInputValue).mul(this.item.tokenUsdValue)
  }

  get inputValueToken() {
    if (!this.getInputValue) return 0

    return Big(this.getInputValue).div(this.item.tokenUsdValue)
  }

  get getTokenOrFiat() {
    return this.isSwap ? "USD" : this.getTokenSymbol
  }

  get getFiatOrTokenInput() {
    return this.isSwap ? `${this.inputValueToken.toFixed(2)} ${this.getTokenSymbol}` : formatToCurrency(this.inputValueFiat)
  }

  get isButtonDisabled() {
    return isEmpty(this.getInputValue)
  }

  get getDepositButtonText() {
    return `${t(this.isDeposit ? "home.deposit" : "home.borrow")} ${formatToCurrency(this.inputValueFiat)}`
  }

  get getTransactionFiatFee() {
    return `${t("common.fee")} $${(+utils.formatUnits(+Big(this.gasPrice).mul(this.gasLimit), 18) * this.nativeCoinPrice).toFixed(2)}`
  }

  setTransactionFeeModalVisible = (state: boolean = false) => {
    this.showTransactionFeeModal = state
  }

  handleTransactionFee = () => {
    this.showTransactionFeeModal = true
  }

  handleButtonClick = async () => {
    let gas = 0
    let inputValue = await this.getValue(this.getInputValue)

    this.gasEstimating = true
    this.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, inputValue)
    this.txPrice = this.gasPrice.mul(this.gasLimit)

    this.gasEstimating = false

    if (this.isEther) {
      inputValue = this.txPrice.sub(inputValue)
    }

    try {
      if (this.isDeposit) {
        const supplyHash = await this.cTokenContract.supply(inputValue, gas)

        if (supplyHash) {
          await this.comptroller.waitForTransaction(supplyHash)
        }
      } else {
        const borrowHash = await this.cTokenContract.borrow(inputValue)

        if (borrowHash) {
          await this.comptroller.waitForTransaction(borrowHash)
        }
      }
    } catch (e) {
      Logger.log("ERR", e)
    }
  }

  setInputValue = (value: string) => {
    if (!/^([0-9]+)?(\.)?([0-9]+)?$/.test(value)) {
      return
    }

    if (this.inputValue.length === 0 && value === '.') {
      this.inputValue = "0."
      return
    }

    this.inputValue = value
  }

  mounted = async (state: TransactionState) => {
    const {isDeposit, item, borrowLimit, totalBorrow} = state

    this.item = item
    this.borrowLimit = borrowLimit
    this.totalBorrow = totalBorrow
    this.isDeposit = isDeposit

    if (this.ethAccount) {
      const isEth = await isEther(this.item.cToken)

      this.comptroller = new Comptroller(this.ethAccount)

      this.tokenContract = new Token(
        this.item.token,
        this.item.cToken,
        this.ethAccount,
        isEth
      )

      this.cTokenContract = new Ctoken(this.item.cToken, this.ethAccount, isEth)

      this.faucetContract = new FaucetToken(
        this.item.token,
        this.item.cToken,
        this.ethAccount,
        true
      )

      this.gasEstimating = true

      try {
        await Promise.all([
          this.estimateGasLimit(),
          this.getGasFee(),
          this.getNativeCoinCost()
        ])
      } catch (e) {
      } finally {
        this.gasEstimating = false
      }
    }

    this.isRefreshing = false
  }

  getValue = async (value: any) => {
    const tokenDecimals = this.isEther
      ? 18
      : await this.tokenContract.getDecimals()

    const decimals = Big(10).pow(+tokenDecimals)

    return Big(value)
      .times(decimals)
      .toFixed()
  }

  setMaxValue = () => {
    let maxValue = this.balance

    if (this.isSwap) {
      maxValue = Big(this.item.tokenUsdValue).mul(this.balance)
    }

    this.setInputValue(maxValue.toString())
  }

  onSwap = () => {
    this.isSwap = !this.isSwap
  }

  getGasFee = async () => {
    try {
      this.gasPrice = await getProviderStore.currentProvider.getGasPrice()
    } catch (e) {
      Logger.log("Gas price fetching error: ", e)
    } finally {
    }
  }

  estimateGasLimit = async () => {
    try {
      this.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, 1)
    } catch (e) {
      Logger.info("Gas limit estimation error: ", e)
    }
  }

  getNativeCoinCost = async () => {
    try {
      const nativeCoin = getProviderStore.currentNetwork.nativeCoin
      const cost = await this.api.get<CoinCostResponse>(COINGECKO_ROUTES.GET_TOKEN_PRICE, {
        queryParams: {
          ids: nativeCoin,
          vs_currencies: "usd"
        }
      })
      this.nativeCoinPrice = cost.data[nativeCoin]["usd"]
    } catch (e) {
      Logger.log("Coin cost error: ", e)
    }
  }
}