import {IReactionDisposer, makeAutoObservable, reaction} from "mobx"
import {BorrowSupplyItem, FinanceCostResponse, FinanceCurrency} from "models/types"
import {t} from "translations/translate"
import {Logger} from "utils/logger"
import Big from "big.js"
import {formatToCurrency, formatToNumber, formatValue} from "utils/utils"
import {utils} from "ethers"
import {TransactionState} from "screens/transaction/Transaction"
import {isEmpty} from "utils/textUtils"
import {getProviderStore} from "App"
import {Comptroller} from "models/Comptroller"
import {Ctoken} from "models/CToken"
import {ApiService} from "services/apiService/apiService"
import {API_FINANCE, FINANCE_ROUTES} from "constants/network"
import {TRANSACTION_TYPE} from "models/contracts/types"
import {WBGL} from "models/WBGL"
import {BUSD} from "models/BUSD"
import {TRANSACTION_STATUS, transactionStore} from "stores/app/transactionStore"
import {NavigateFunction} from "react-router-dom"
import {REG} from "models/constants/constants"

export class TransactionViewModel {
  item: BorrowSupplyItem = {} as any
  isRefreshing = true
  transactionType = TRANSACTION_TYPE.DEPOSIT
  borrowLimit = 0
  totalBorrow = 0
  inputValue = ""
  comptroller: any
  cTokenContract: Ctoken
  gasEstimating = false

  nativeCoinPrice: FinanceCurrency = {
    currency: "",
    price: 0,
    source: "",
    time: ""
  }
  inputFiat = false

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
  inputRef?: any
  selectedToken: WBGL | BUSD
  nav?: NavigateFunction

  swapReaction?: IReactionDisposer

  protected readonly api: ApiService

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
    this.api = new ApiService()
    this.api.init(API_FINANCE)
  }

  setNavigation = (nav: NavigateFunction) => {
    this.nav = nav
  }

  mounted = async (state: TransactionState) => {
    const {transactionType, item, borrowLimit, totalBorrow} = state

    this.item = item
    this.borrowLimit = borrowLimit
    this.totalBorrow = totalBorrow
    this.transactionType = transactionType

    if (this.isWBGL) {
      this.selectedToken = new WBGL(getProviderStore.signer, getProviderStore.currentAccount)
    } else {
      this.selectedToken = new BUSD(getProviderStore.signer, getProviderStore.currentAccount)
    }

    this.swapReaction = reaction(() => this.inputFiat, (val) => {
      this.inputValue = !val ?
        this.inputValueToken ? this.inputValueToken.toString() : "" :
        this.inputValueFiat ? this.inputValueFiat.toString(): ""
      this.inputRef?.focus()
    })

    if (getProviderStore.currentAccount) {
      this.comptroller = new Comptroller(getProviderStore.currentAccount)
      this.cTokenContract = new Ctoken(this.item.cToken, getProviderStore.currentAccount, this.isWBGL)
      this.gasEstimating = true

      try {
        await Promise.all([
          this.estimateGasLimit(),
          this.getGasFee(),
          this.getNativeCoinCost()
        ])
      } catch (e) {
        Logger.error('Init error', e)
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

  get isRepay() {
    return this.transactionType === TRANSACTION_TYPE.REPAY
  }

  get isWBGL() {
    return this.item.symbol === getProviderStore.currentNetwork.WBGLSymbol
  }

  get isBUSD() {
    return this.item.symbol === getProviderStore.currentNetwork.BUSDSymbol
  }

  get isEnoughBalance() {
    if (this.isDeposit) {
      return this.inputFiat ? this.item.balance.mul(this.item.tokenUsdValue).gte(+this.inputValue) : this.item.balance.gte(+this.inputValue)
    }
    return true
  }

  get getInputFontSize() {
    return this.getInputValue.length < 7
      ? "32px"
      : "26px"
  }

  get getTokenSymbol() {
    return this.item.symbol
  }

  get balance() {
    return this.item.balance
  }

  get tokenBalance() {
    if (this.isWithdraw) {
      return this.item.supply
    }

    if (this.isBorrow) {
      let maxValue

      if (!this.borrowLimit) {
        maxValue = 0
      } else {
        const maxBorrow = ((this.borrowLimit * 0.8) - this.totalBorrow); // in USD
        maxValue = this.borrowLimitUsed >= 80 ? 0 : maxBorrow;

        if (!this.inputFiat) {
          maxValue = Big(maxValue).div(this.item.tokenUsdValue)
        }
      }

      return maxValue
    }

    if (this.isRepay) {
      return this.item.borrow
    }

    return this.item.balance
  }

  get tokensFiatPrice() {
    let balance = this.isBorrow ? this.item.borrow : this.tokenBalance
    return Big(this.item.tokenUsdValue).mul(balance)
  }

  get titleBasedOnType() {
    let title = t("home.deposit")

    if (this.isBorrow) {
      title = t("home.borrow")
    } else if (this.isWithdraw) {
      title = t("transaction.withdraw")
    } else if (this.isRepay) {
      title = t("transaction.repay")
    }

    return title
  }

  get buttonTitleBasedOnType() {
    let title: string

    if (this.isBorrow) {
      title = this.borrowText
    } else if (this.isWithdraw) {
      title = this.withdrawText
    } else if (this.isRepay) {
      title = this.repayText
    } else {
      title = this.depositText
    }

    return title
  }

  get getTitle() {
    return `${this.titleBasedOnType} ${this.getTokenSymbol}`
  }

  get tokenBalanceDisplay() {
    return `${formatValue(this.tokenBalance, undefined, '')}`
  }

  get tokenFiatDisplay() {
    if (this.isDeposit) {
      return `${formatValue(Big(this.item.balance).mul(this.item.tokenUsdValue))}`
    }

    if (this.isWithdraw) {
      return `${formatValue(Big(this.item.supply).mul(this.item.tokenUsdValue))}`
    }

    if (this.isBorrow) {
      let maxValue

      if (!this.borrowLimit) {
        maxValue = 0
      } else {
        const maxBorrow = ((this.borrowLimit * 0.8) - this.totalBorrow); // in USD
        maxValue = this.borrowLimitUsed >= 80 ? 0 : maxBorrow;
      }

      return `${formatValue(maxValue)}`
    }

    if (this.isRepay) {
      return `${formatValue(Big(this.item.borrow).mul(this.item.tokenUsdValue))}`
    }

    return `${formatValue(this.item.tokenUsdValue)}`
  }

  get getApyTitle() {
    return `${t(this.isDeposit || this.isWithdraw ? "home.deposit" : "home.borrow")} ${t("home.netApy")}`
  }

  get getApyValue() {
    return `${this.isDeposit || this.isWithdraw ? this.item.supplyApy : this.item.borrowApy}%`
  }

  get getBorrowLimitTitle() {
    return `${t(this.isDeposit || this.isWithdraw ? "home.borrowLimit" : "transaction.borrowBalance")}`
  }

  get getBorrowLimitValue() {
    return formatToCurrency(this.isDeposit || this.isWithdraw ? this.borrowLimit : this.totalBorrow)
  }

  get getBorrowLimitUsedValue() {
    return `${formatToNumber(this.borrowLimitUsed)}%`
  }

  get getNewBorrowLimitUsed() {
    if (this.isDeposit || this.isWithdraw) {
      return this.hypotheticalBorrowLimitUsedForDeposit
        ? formatToNumber(this.hypotheticalBorrowLimitUsedForDeposit)
        : 0
    } else if (this.isBorrow || this.isRepay) {
      return this.inputValue ? formatToNumber(this.hypotheticalBorrowLimitUsed) : 0
    }
    return 0
  }

  get getNewBorrowLimitUsedFormatted() {
    return `${this.getNewBorrowLimitUsed}%`
  }

  get maxBorrowLimitUsed() {
    return Math.max(this.borrowLimitUsed, +this.getNewBorrowLimitUsed)
  }

  get borrowLimitUsed() {
    if (this.borrowLimit) {
      const limit = (this.totalBorrow / this.borrowLimit) * 100
      return parseFloat(limit.toFixed(2))
    }
    return 0
  }

  get getInputValue() {
    return this.inputValue
  }

  get inputValueUSD() {
    return this.inputFiat ? +this.inputValue : +this.inputValueFiat
  }

  get inputValueTOKEN() {
    return this.inputFiat ? +this.inputValueToken : +this.inputValue
  }

  get getNewBorrowLimit() {
    return formatToCurrency(this.newBorrowLimit)
  }

  get newBorrowLimit() {
    if (this.isDeposit || this.isWithdraw) {
      if (!this.inputValue) return 0
      if (!this.item.isEnteredTheMarket) return this.borrowLimit

      if (this.isWithdraw) {
        return this.borrowLimit - this.inputValueUSD * +this.collateralMantissa
      }

      return this.borrowLimit + this.inputValueUSD * +this.collateralMantissa
    }

    return this.borrowBalance ? this.borrowBalance : 0
  }

  get collateralMantissa() {
    return this.item.collateralFactorMantissa / 1e18
  }

  get inputValueFiat() {
    if (!this.inputValue) return 0
    return Big(this.inputValue).mul(this.item.tokenUsdValue)
  }

  get inputValueToken() {
    if (!this.inputValue) return 0
    return Big(this.inputValue).div(this.item.tokenUsdValue)
  }

  get getTokenOrFiat() {
    return this.inputFiat ? "USD" : this.getTokenSymbol
  }

  get getFiatOrTokenInput() {
    if (this.inputFiat) {
      return `${formatValue(this.inputValueToken, undefined, '')} ${this.getTokenSymbol}`
    }
    return `${formatValue(this.inputValueFiat)}`
  }

  get isButtonDisabled() {
    return isEmpty(this.getInputValue) ||
      !this.isEnoughBalance ||
      this.isRepayDisabled ||
      this.isBorrowDisabled ||
      this.isWithdrawDisabled
  }

  get getDepositButtonText() {
    return this.buttonTitleBasedOnType
  }

  get getTransactionFiatFee() {
    return `${t("common.fee")} $${(+utils.formatUnits(+Big(this.txData.gasPrice).mul(this.txData.gasLimit), 18) * this.nativeCoinPrice.price).toFixed(2)}`
  }

  get repayText() {
    if (Big(this.item.borrow).lt(this.inputValueTOKEN)) return t('transaction.valueCannotExceedBorrow')
    if (this.item.balance.lt(this.inputValueTOKEN) || this.item.balance.eq(0)) return t('transaction.insufficientWalletBalance')
    return `${t('transaction.repay')} ${formatValue(this.inputValueUSD)}`
  }

  get depositText() {
    if (this.item.balance.lt(this.inputValueTOKEN) || this.item.balance.eq(0)) return t('transaction.insufficientWalletBalance')
    return `${t("home.deposit")} ${formatValue(this.inputValueUSD)}`
  }

  get isRepayDisabled() {
    if (this.isRepay) {
      return !Boolean(this.inputValueTOKEN) ||
        this.balance.lt(this.inputValueTOKEN) ||
        Big(this.item.borrow).lt(this.inputValueTOKEN)
    }
    return false
  }

  get withdrawText() {
    if (Big(this.item.supply).lt(this.inputValueTOKEN)) return t('transaction.valueCannotExceedSupply')
    return `${t("transaction.withdraw")} ${formatToCurrency(this.inputValueUSD)}`
  }

  get borrowText() {
    if (this.borrowLimitUsed >= 100) {
      return t('transaction.borrowLimitReached')
    }

    if (!this.isEnoughLiquidity) {
      return t('transaction.notEnoughLiquidity')
    }

    if (
      !this.borrowLimit ||
      this.borrowLimitUsed >= 100 ||
      this.hypotheticalBorrowLimitUsed >= 100
    ) {
      return t('transaction.insufficientCollateral')
    } else {
      return `${t('home.borrow')} ${formatToCurrency(this.inputValueUSD)}`
    }
  }

  // FOR DEPOSIT
  get hypotheticalBorrowLimitUsedForDeposit() {
    if (!this.hypotheticalCollateralSupply || !this.totalBorrow) return 0
    if (this.hypotheticalCollateralSupply < 0) return 100
    if (!this.item.isEnteredTheMarket) return this.borrowLimitUsed

    const limit =
      (this.totalBorrow / this.hypotheticalCollateralSupply) * 100

    return limit > 100 ? 100 : parseFloat(limit.toFixed(2))
  }

  // FOR DEPOSIT
  get hypotheticalCollateralSupply() {
    if (!this.inputValue) return 0

    if (this.isDeposit) {
      return this.borrowLimit + this.inputValueUSD
    }

    return this.borrowLimit - this.inputValueUSD
  }

  get hypotheticalBorrowLimitUsed() {
    if (!this.borrowLimit) return 0
    const limit = (this.borrowBalance / this.borrowLimit) * 100
    return limit > 100 ? 100 : parseFloat(limit.toFixed(2))
  }

  get borrowBalance() {
    if (this.isBorrow) {
      return !this.inputValue ? 0 : this.inputValueUSD + this.totalBorrow
    }

    return !this.inputValue ? 0 : this.totalBorrow - this.inputValueUSD
  }

  get isEnoughLiquidity() {
    return this.inputValueUSD <= this.item.liquidity
  }

  get isBorrowDisabled() {
    if (this.isBorrow) {
      return !this.inputValueTOKEN ||
        !this.borrowLimit ||
        !this.isEnoughLiquidity ||
        this.borrowLimitUsed >= 100 ||
        this.hypotheticalBorrowLimitUsed >= 100
    }
    return false
  }

  get isWithdrawDisabled() {
    if (this.isWithdraw) {
      if (!this.item.isEnteredTheMarket) return true

      return (
        !this.isSupplyDisabled ||
        !Boolean(this.inputValueTOKEN) ||
        Big(this.item.supply).lt(this.inputValueTOKEN)
        // this.hypotheticalBorrowLimitUsedForDeposit >= 100
      )
    }

    return false
  }

  get isSupplyDisabled() {
    return Big(this.item.tokenAllowance).gt(0)
  }

  get supplyTitle() {
    return this.isEnoughBalance ? "home.deposit" : "transaction.insufficientWalletBalance"
  }

  get buttonColor() {
    return this.isBorrow || this.isRepay ? "borrow" : ""
  }

  setInputRef = (ref: any) => {
    this.inputRef = ref
  }

  getValue = (value: string) => {
    const tokenDecimals = 18
    const decimals = Big(10).pow(+tokenDecimals);

    return Big(value)
      .times(decimals)
      .toFixed();
  }

  handleTransaction = async () => {
    transactionStore.clear()

    const input = this.inputFiat ? this.inputValueToken.toString() : this.inputValue
    let inputValue = this.getValue(input)

    try {
      if (this.isDeposit) {
        let approvedResult: any

        transactionStore.transactionMessageVisible = true
        transactionStore.transactionMessageStatus.firstStep.message = t("transaction.allowance")
        transactionStore.transactionMessageStatus.secondStep.message = t("transaction.deposit")
        transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.PENDING

        const allowanceAmount = await this.selectedToken.allowance(
          this.item.cToken
        )

        // check if supply is allowed, otherwise it should be approved
        if (+allowanceAmount < +inputValue) {
          // can proceed with supply
          // need to approve
          try {
            approvedResult = await this.selectedToken.approve(
              this.item.cToken
            )
            this.txData.gasLimit = +approvedResult.gasLimit
            // wait for transaction to be mined in order to proceed with mint
            await approvedResult.wait()
          } catch (e) {
            transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.ERROR
            return
          }
        }

        transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.SUCCESS
        transactionStore.transactionMessageStatus.secondStep.status = TRANSACTION_STATUS.PENDING

        try {
          const {hash} = await this.cTokenContract.supply(inputValue)

          if (hash) {
            await this.comptroller.waitForTransaction(hash)
            transactionStore.transactionHash = hash
            transactionStore.transactionMessageStatus.secondStep.status = TRANSACTION_STATUS.SUCCESS
            this.navigateBack()
          }
        } catch (e) {
          transactionStore.transactionMessageStatus.secondStep.status = TRANSACTION_STATUS.ERROR
        }
      } else if (this.isBorrow) {
        const isMarketExist = await this.isMarketExist()

        if (!isMarketExist) {
          Logger.info("Market is not available!!") // TODO show toast
          return
        }

        transactionStore.transactionMessageVisible = true
        transactionStore.transactionMessageStatus.firstStep.message = t("transaction.borrow")
        transactionStore.transactionMessageStatus.secondStep.visible = false
        transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.PENDING

        // for borrow
        try {
          const {hash} = await this.cTokenContract.borrow(inputValue)

          if (hash) {
            await this.comptroller.waitForTransaction(hash)
            transactionStore.transactionHash = hash
            transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.SUCCESS
            this.navigateBack()
          }
        } catch (e) {
          transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.ERROR
        }
      } else if (this.isWithdraw) {
        // check if number is too small for transaction
        if (
          Big(+inputValue)
            .times(1e18)
            .div(this.item.exchangeRateCurrent)
            .lt(1)
        ) {
          Logger.info("error")
          return
        }

        transactionStore.transactionMessageVisible = true
        transactionStore.transactionMessageStatus.firstStep.message = t("transaction.withdrawal")
        transactionStore.transactionMessageStatus.secondStep.visible = false
        transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.PENDING

        try {
          const {hash} = await this.cTokenContract.withdraw(inputValue)

          if (hash) {
            await this.comptroller.waitForTransaction(hash)
            transactionStore.transactionHash = hash
            transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.SUCCESS
            this.navigateBack()
          }
        } catch (e) {
          transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.ERROR
        }
      } else if (this.isRepay) {
        let approvedResult: any

        transactionStore.transactionMessageVisible = true
        transactionStore.transactionMessageStatus.firstStep.message = t("transaction.allowance")
        transactionStore.transactionMessageStatus.secondStep.message = t("transaction.repayBorrow")
        transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.PENDING

        const allowanceAmount = await this.selectedToken.allowance(
          this.item.cToken
        )

        // check if spending token is allowed, otherwise it should be approved
        if (+allowanceAmount < +inputValue) {
          // need to approve
          try {
            approvedResult = await this.selectedToken.approve(
              this.item.cToken
            )
            this.txData.gasLimit = +approvedResult.gasLimit
            // wait for transaction to be mined in order to proceed with repay
            await approvedResult.wait()
          } catch (e) {
            transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.ERROR
            return
          }
        }

        transactionStore.transactionMessageStatus.firstStep.status = TRANSACTION_STATUS.SUCCESS
        transactionStore.transactionMessageStatus.secondStep.status = TRANSACTION_STATUS.PENDING

        try {
          const {hash} = await this.cTokenContract.repayBorrow(inputValue)

          if (hash) {
            await this.comptroller.waitForTransaction(hash)
            transactionStore.transactionHash = hash
            transactionStore.transactionMessageStatus.secondStep.status = TRANSACTION_STATUS.SUCCESS
            this.navigateBack()
          }
        } catch (e) {
          transactionStore.transactionMessageStatus.secondStep.status = TRANSACTION_STATUS.ERROR
        }
      }
    } catch (e: any) {
      Logger.error(e)
    }
  }

  isMarketExist = async () => {
    const markets = await this.comptroller.getAllMarkets()
    return markets.includes(this.item.cToken)
  }

  setInputValue = (value: string) => {
    if (!REG.DIGITS_INPUT.test(value)) {
      return
    }

    if (this.inputValue.length === 0 && value === '.') {
      this.inputValue = "0."
      return
    }

    this.inputValue = value
  }

  navigateBack = () => {
    this.nav?.(-1)
  }

  unMounted = () => {
    this.swapReaction?.()
    this.inputRef = null
  }

  setMaxValue = () => {
    let maxValue = this.item.balance

    if (this.isDeposit) {
      if (this.item.balance.eq(0)) {
        maxValue = 0
      } else {
        maxValue = this.inputFiat ? Big(this.item.tokenUsdValue).mul(this.item.balance) : this.item.balance
      }
    }

    if (this.isBorrow) {
      if (!this.borrowLimit) {
        maxValue = 0
      } else {
        const maxBorrow = ((this.borrowLimit * 0.8) - this.totalBorrow); // in USD
        maxValue = this.borrowLimitUsed >= 80 ? 0 : maxBorrow;

        if (!this.inputFiat) {
          maxValue = Big(maxValue).div(this.item.tokenUsdValue)
        }
      }
    }

    if (this.isWithdraw) {
      maxValue = this.inputFiat ? Big(this.item.tokenUsdValue).mul(this.item.supply) : this.item.supply
    }

    if (this.isRepay) {
      if (this.item.balance.eq(0)) {
        maxValue = 0
      } else {
        maxValue = +this.item.borrow ? +this.item.borrow : 0

        if (this.inputFiat) {
          maxValue = Big(maxValue).mul(this.item.tokenUsdValue)
        }
      }
    }

    const isInvalidValue = !new RegExp(REG.NUMBER).test(maxValue);

    this.setInputValue(
      isInvalidValue
        ? String(maxValue).substring(0, 16)
        : maxValue || "0"
    )
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

  estimateGasLimit = async (amount: any = 0) => {
    try {
      this.txData.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, amount)
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
