import {makeAutoObservable, reaction} from "mobx"
import {BorrowSupplyItem, FinanceCostResponse, FinanceCurrency} from "models/types"
import {t} from "translations/translate"
import {Logger} from "utils/logger"
import Big from "big.js"
import {formatBalance, formatToCurrency, formatToNumber} from "utils/utils"
import {ethers, utils} from "ethers"
import {TransactionState} from "screens/transaction/Transaction"
import {isEmpty} from "utils/textUtils"
import {Token} from "models/Token"
import {getProviderStore} from "App"
import {isEther} from "models/ContractsAPI"
import {Comptroller} from "models/Comptroller"
import {Ctoken} from "models/CToken"
import {FaucetToken} from "models/FaucetToken"
import {ApiService} from "services/apiService/apiService"
import {API_FINANCE, FINANCE_ROUTES} from "constants/network"
import {TRANSACTION_TYPE} from "models/contracts/types"
import {WBGLTestContract} from "models/contracts/WBGLTestContract"

export class TransactionViewModel {
  item: BorrowSupplyItem = {} as any
  isRefreshing = true
  transactionType = TRANSACTION_TYPE.DEPOSIT
  borrowLimit = 0
  totalBorrow = 0
  inputValue = ""
  tokenContract: any
  comptroller: any
  account?: string | null = null
  cTokenContract: Ctoken
  faucetContract: any
  gasEstimating = false
  txPrice: any = 0

  fastGas: any = 0
  fastestGas: any = 0
  safeLowGas: any = 0

  showTransactionFeeModal = false
  nativeCoinPrice: FinanceCurrency = {
    currency: "",
    price: 0,
    source: "",
    time: ""
  }
  inputFiat = true;

  txData = {
    data: undefined,
    chainId: 0,
    gasLimit: 21000,
    gasPrice: Big(0),
    nonce: 0,
    value: "0",
    to: "",
    from: "",
  }
  lastVal: string;

  protected readonly api: ApiService

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
    this.account = getProviderStore.currentAccount
    this.api = new ApiService()
    this.api.init(API_FINANCE)
  }

  get isDeposit() {
    return this.transactionType === TRANSACTION_TYPE.DEPOSIT
  }

  get isBorrow() {
    return this.transactionType === TRANSACTION_TYPE.BORROW
  }

  get isWithdraw() {
    return this.transactionType === TRANSACTION_TYPE.WITHDRAW
  }

  get isWBGLTest() {
    return this.item.symbol === 'wbglTest'
  }

  get isBUSDTest() {
    return this.item.symbol === 'busdTest'
  }

  get isEnoughBalance() {
    if (this.inputFiat) {
      return this.balance.mul(this.item.tokenUsdValue).gte(+this.getInputValue)
    }
    return this.balance.gte(+this.getInputValue)
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

  get isNative() {
    return this.item.symbol === getProviderStore.currentNetwork.nativeSymbol
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
    return this.inputFiat ? "USD" : this.getTokenSymbol
  }

  get getFiatOrTokenInput() {
    if (this.inputFiat) {
      return `${this.inputValueToken.toFixed(2)} ${this.getTokenSymbol}`
    }
    return formatToCurrency(this.inputValueFiat)
  }

  get isButtonDisabled() {
    return isEmpty(this.getInputValue) || !this.isEnoughBalance
  }

  get getDepositButtonText() {
    return `${t(this.isDeposit ? "home.deposit" : "home.borrow")} ${formatToCurrency(this.inputFiat ? this.inputValue : this.inputValueFiat)}`
  }

  get getTransactionFiatFee() {
    return `${t("common.fee")} $${(+utils.formatUnits(+Big(this.txData.gasPrice).mul(this.txData.gasLimit), 18) * this.nativeCoinPrice.price).toFixed(2)}`
  }

  setTransactionFeeModalVisible = (state: boolean = false) => {
    this.showTransactionFeeModal = state
  }

  handleTransactionFee = () => {
    this.showTransactionFeeModal = true
  }

  handleButtonClick = async () => {
    let gas = 30
    let inputValue = 0

    const wbgl = WBGLTestContract("0x88Ab2F4Eb09Be66535C66EF2FF11780B8A86d86a", getProviderStore.signer)
    const res = await wbgl.approve("0x88Ab2F4Eb09Be66535C66EF2FF11780B8A86d86a", inputValue)

    console.log("okay", res)
    console.log("ctoken", this.item.cToken)

    this.gasEstimating = true
    // this.txData.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, inputValue)
    this.txData.gasLimit = await this.cTokenContract.getEstimateGas(
      "",
      ethers.utils
        .parseUnits(this.inputValue, 18)
        .toHexString()
    )


    console.log("gas limit", this.txData.gasLimit)
    this.txPrice = this.txData.gasPrice.mul(this.txData.gasLimit)

    this.gasEstimating = false

    if (this.isNative) {
      inputValue = this.txPrice.sub(inputValue)
    }

    try {
      if (this.isDeposit) {
        const supplyHash = await this.cTokenContract.supply(inputValue, gas)

        console.log("hash", supplyHash)
        return

        if (supplyHash) {
          const ibi = await this.comptroller.waitForTransaction(supplyHash.hash)
          console.log("tesss", ibi)
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

  get transactionTotalAmount() {
    return this.txData.gasPrice ? +this.inputValueToken + this.transactionFee : 0;
  }

  get transactionFee() {
    try {
      return +ethers.utils.formatUnits(
        (+this.txData.gasPrice * this.txData.gasLimit).toString(),
        18
      );
    } catch (e) {
      console.log("ERROR-FEE", e);
      return 0;
    }
  }

  mounted = async (state: TransactionState) => {
    const {transactionType, item, borrowLimit, totalBorrow} = state

    this.item = item
    this.borrowLimit = borrowLimit
    this.totalBorrow = totalBorrow
    this.transactionType = transactionType

    if (this.account) {
      const isEth = await isEther(this.item.cToken)

      this.comptroller = new Comptroller(this.account)

      this.tokenContract = new Token(
        this.item.token,
        this.item.cToken,
        this.account,
        isEth
      )

      this.cTokenContract = new Ctoken(this.item.cToken, this.account, isEth)

      this.faucetContract = new FaucetToken(
        this.item.token,
        this.item.cToken,
        this.account,
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
    const tokenDecimals = this.isNative
      ? 18
      : await this.tokenContract.getDecimals()

    const decimals = Big(10).pow(+tokenDecimals)

    return Big(value)
      .times(decimals)
      .toFixed()
  }

  setMaxValue = () => {
    let maxValue = this.balance

    if (this.inputFiat) {
      maxValue = Big(this.item.tokenUsdValue).mul(this.balance)
    }

    this.setInputValue(maxValue.toString())
  }

  onSwap = () => {
    this.inputValue = this.inputFiat ? this.inputValueToken.toFixed(2) : this.inputValueFiat.toFixed(2)
    this.inputFiat = !this.inputFiat
  }

  getGasFee = async () => {
    try {
      this.txData.gasPrice = await getProviderStore.currentProvider.getGasPrice()
      console.log("mda", +utils.formatUnits(+this.txData.gasPrice.mul(this.txData.gasLimit), 18))
      console.log("gas", +this.txData.gasPrice)
    } catch (e) {
      Logger.log("Gas price fetching error: ", e)
    } finally {
    }
  }

  estimateGasLimit = async () => {
    try {
      this.txData.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, 1)
      console.log("gas limit", this.txData.gasLimit)
    } catch (e) {
      Logger.info("Gas limit estimation error: ", e)
    }
  }

  getNativeCoinCost = async () => {
    try {
      const nativeSymbol = getProviderStore.currentNetwork.nativeSymbol
      const fiatCurrency = "usd"

      const costResponse = await this.api.get<FinanceCostResponse>(FINANCE_ROUTES.GET_PRICES, {
        queryParams: {
          symbol: nativeSymbol,
          currency: fiatCurrency
        }
      })
      if (costResponse.isOk) {
        this.nativeCoinPrice = costResponse.data.payload[nativeSymbol][fiatCurrency] as FinanceCurrency
      }
    } catch (e) {
      Logger.log("Coin cost error: ", e)
    }
  }
}
