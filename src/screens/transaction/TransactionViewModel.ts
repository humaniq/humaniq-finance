import {IReactionDisposer, makeAutoObservable, reaction, runInAction} from "mobx"
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
import {TRANSACTION_STATUS} from "components/transaction-message/TransactionMessage"
import {WBGL} from "models/WBGL"
import {BUSD} from "models/BUSD"

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
  inputFiat = true

  txData = {
    data: undefined,
    chainId: 0,
    gasLimit: 21000,
    gasPrice: Big(0),
    nonce: 0,
    value: "0",
    to: "",
    from: ""
  }
  lastVal: string
  inputRef?: any
  transactionInProgress = false
  transactionMessageVisible = false;
  transactionMessageStatus = TRANSACTION_STATUS.PENDING;
  transactionMessage = "";

  selectedToken: WBGL | BUSD

  swapReaction?: IReactionDisposer

  protected readonly api: ApiService

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
    this.account = getProviderStore.currentAccount
    this.api = new ApiService()
    this.api.init(API_FINANCE)
  }

  mounted = async (state: TransactionState) => {
    const {transactionType, item, borrowLimit, totalBorrow} = state

    this.item = item
    this.borrowLimit = borrowLimit
    this.totalBorrow = totalBorrow
    this.transactionType = transactionType

    if (this.isWBGL) {
      this.selectedToken = new WBGL(getProviderStore.signer, this.account)
    } else {
      console.log("busdddd")
      this.selectedToken = new BUSD(getProviderStore.signer, this.account)
    }

    this.swapReaction = reaction(() => this.inputFiat, (val) => {
      this.inputValue = !val ?
        this.inputValueToken ? this.inputValueToken.toFixed(2) : "" :
        this.inputValueFiat ? this.inputValueFiat.toFixed(2) : ""

      this.inputRef?.focus()
    })

    if (this.account) {
      const isEth = await isEther(this.item.cToken)

      this.comptroller = new Comptroller(this.account)

      this.tokenContract = new Token(
        this.item.token,
        this.item.cToken,
        this.account,
        isEth
      )

      this.cTokenContract = new Ctoken(this.item.cToken, this.account, this.isWBGL)

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

  get isDeposit() {
    return this.transactionType === TRANSACTION_TYPE.DEPOSIT
  }

  get isBorrow() {
    return this.transactionType === TRANSACTION_TYPE.BORROW
  }

  get isWithdraw() {
    return this.transactionType === TRANSACTION_TYPE.WITHDRAW
  }

  get isWBGL() {
    return this.item.symbol === 'TWBGL'
  }

  get isBUSD() {
    return this.item.symbol === 'BUSD'
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

  get tokensFiatPrice() {
    return formatToCurrency(Big(this.item.tokenUsdValue).mul(this.balance))
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

  setInputRef = (ref: any) => {
    this.inputRef = ref
  }

  setTransactionFeeModalVisible = (state: boolean = false) => {
    this.showTransactionFeeModal = state
  }

  handleTransactionFee = () => {
    this.showTransactionFeeModal = true
  }

  handleTransaction = async () => {
    const input = this.inputFiat ? this.inputValueToken.toFixed(2) : this.inputValue
    let inputValue = this.getValue(input)
    this.txPrice = this.txData.gasPrice.mul(this.txData.gasLimit)

    if (this.isNative) {
      inputValue = this.txPrice.sub(inputValue)
    }
    try {
      if (this.isDeposit) {
        let approvedResult: boolean

        const allowanceAmount = await this.selectedToken.allowance(
          this.item.cToken
        )

        console.log("allowance", +allowanceAmount)
        console.log("inputValue", +inputValue)

        // check if supply is allowed, otherwise it should be approved
        if (+allowanceAmount >= +inputValue) {
          // can proceed with supply
          approvedResult = true
        } else {
          // need to approve
          approvedResult = !!await this.selectedToken.approve(
            this.item.cToken, inputValue
          )
        }
        if (approvedResult) {
          runInAction(() => this.transactionInProgress = true)
          const {hash} = await this.cTokenContract.supply(inputValue)

          if (hash) {
            const supplyRes = await this.comptroller.waitForTransaction(hash)
            console.log("supplyRes", supplyRes)
            runInAction(() => this.transactionMessageStatus = TRANSACTION_STATUS.SUCCESS)
            this.transactionMessageVisible = true;
          }
        }
      } else if (this.isBorrow) {
        const isMarketExists = await this.isMarketExists();

        console.log("isMarketExists", isMarketExists)

        if (!isMarketExists) {
          console.log("Market is not available!!")
          return;
        }
        // for borrow
        const {hash} = await this.cTokenContract.borrow(inputValue)
        if (hash) {
          const depositRes = await this.comptroller.waitForTransaction(hash)
          console.log("supplyRes", depositRes)
        }
      } else {
        // for withdraw
      }
    } catch (e: any) {
      console.error(e)
      if (e.code === 4001) {
        runInAction(() => this.transactionMessage = t("transactionMessage.denied"))
      }
      runInAction(() => {
        this.transactionMessageStatus = TRANSACTION_STATUS.ERROR;
        this.transactionMessageVisible = true;
      })
      } finally {
      setTimeout(() => {
        runInAction(() => {
          this.transactionMessageVisible = false;
          this.transactionMessage = "";
        })
      }, 3000);
      runInAction(() => this.transactionInProgress = false)
    }
  }

  isMarketExists = async () => {
    const markets = await this.comptroller.getAllMarkets();
    return markets.includes(this.item.cToken);
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
    return this.txData.gasPrice ? +this.inputValueToken + this.transactionFee : 0
  }

  get transactionFee() {
    try {
      return +ethers.utils.formatUnits(
        (+this.txData.gasPrice * this.txData.gasLimit).toString(),
        18
      )
    } catch (e) {
      console.log("ERROR-FEE", e)
      return 0
    }
  }

  unMounted = () => {
    this.swapReaction?.()
    this.inputRef = null
  }

  getValue = (value: any) => {
    const tokenDecimals = this.isNative
      ? 18
      : this.item.underlyingDecimals

    return ethers.utils.parseUnits(value, tokenDecimals)
  }

  setMaxValue = () => {
    let maxValue = this.balance
    if (this.inputFiat) {
      maxValue = Big(this.item.tokenUsdValue).mul(this.balance)
    }
    this.setInputValue(maxValue.toFixed(2))
    this.inputRef?.focus()
  }

  onSwap = () => {
    this.inputFiat = !this.inputFiat
  }

  getGasFee = async () => {
    try {
      this.txData.gasPrice = await getProviderStore.currentProvider.getGasPrice()
    } catch (e) {
      Logger.log("Gas price fetching error: ", e)
    }
  }

  estimateGasLimit = async () => {
    try {
      this.txData.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, 0)
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
