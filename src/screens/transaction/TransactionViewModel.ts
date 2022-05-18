import {makeAutoObservable} from "mobx"
import {BorrowSupplyItem} from "models/types"
import {t} from "translations/translate"
import {Logger} from "utils/logger"
import Big from "big.js"
import {formatBalance, formatToCurrency, formatToNumber} from "utils/utils"
import {BigNumber, utils} from "ethers"
import {TransactionState} from "screens/transaction/Transaction"
import {isEmpty, toLowerCase} from "utils/textUtils"
import {Token} from "models/Token"
import {getProviderStore} from "App"
import {isEther} from "models/ContractsAPI"
import {Comptroller} from "models/Comptroller"
import {Ctoken} from "models/CToken"
import {FaucetToken} from "models/FaucetToken"
import {ApiService} from "services/apiService/apiService"
import {GAS_FEE, GAS_PRICE_SPEED, URLS} from "constants/api"
import {GasFeeData, GasFeeResponse} from "models/contracts/types"

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
  ethAccount?: string | null = null;
  cTokenContract: Ctoken
  faucetContract: any
  gasEstimating = false
  txPrice: any = 0

  gasPrice: any = Big(0)
  gasLimit: any = 21000
  selectedSpeed = GAS_PRICE_SPEED.FAST

  fastGas: any = 0
  fastestGas: any = 0
  safeLowGas: any = 0

  showTransactionFeeModal = false

  protected readonly api: ApiService

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
    this.ethAccount = getProviderStore.currentAccount
    this.api = new ApiService()
    this.api.init()
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
    return Big(this.item.balance)
  }

  get getFormattedBalance() {
    return `${formatBalance(this.balance)} ${this.getTokenSymbol}`
  }

  get getTitle() {
    return `${t(this.isDeposit ? "home.deposit" : "home.borrow")} ${this.getTokenSymbol}`
  }

  get getTokenBalance() {
    return `${this.balance.toFixed(2)}`
  }

  get getTokenUsdValue() {
    return formatToCurrency(this.item.tokenUsdValue)
  }

  get getDepositPerYear() {
    return `${this.isDeposit ? this.item.supplyApy : this.item.borrowApy}%`
  }

  get getBorrowLimit() {
    return formatToCurrency(this.borrowLimit)
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

    return Big(this.getInputValue).mul(Big(this.item.tokenUsdValue))
  }

  get inputValueToken() {
    if (!this.getInputValue) return 0

    return Big(this.getInputValue).div(Big(this.item.tokenUsdValue))
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
    return `${this.selectedGasPriceLabel} ${toLowerCase(t("common.fee"))} $${(+utils.formatUnits(this.gasPrice.mul(this.gasLimit), 18) * 2055).toFixed(2)}`
  }

  get selectedGasPriceLabel() {
    switch (this.selectedSpeed) {
      case GAS_PRICE_SPEED.FAST:
        return t("common.normal")
      case GAS_PRICE_SPEED.FASTEST:
        return t("common.fast")
      default:
        return t("common.low")
    }
  }

  get selectedGasPrice() {
    switch (this.selectedSpeed) {
      case GAS_PRICE_SPEED.FAST:
        return this.fastFee
      case GAS_PRICE_SPEED.FASTEST:
        return this.fastestFee
      default:
        return this.safeLowFee
    }
  }

  get fastFee() {
    return (this.fastGas * 1.25).toFixed(0)
  }

  get fastestFee() {
    return (this.fastestGas * 1.5).toFixed(0)
  }

  get safeLowFee() {
    return this.safeLowGas.toFixed(0)
  }

  setTransactionFeeModalVisible = (state: boolean = false) => {
    this.showTransactionFeeModal = state
  }

  handleTransactionFee = () => {
    this.showTransactionFeeModal = true
  }

  handleButtonClick = async () => {
    let gas = 0;
    let supplyValue = await this.getValue(this.getInputValue);

    this.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, supplyValue)
    this.gasPrice = await getProviderStore.provider.getFeeData() as GasFeeData
    this.txPrice = this.gasPrice.gasPrice.mul(this.gasLimit)

    this.gasEstimating = false

    if (this.isEther) {
      supplyValue = this.txPrice.sub(supplyValue);
    }

    try {
      const res = await this.cTokenContract.supply(supplyValue, gas)

      if (res) {
        await this.comptroller.waitForTransaction(res);
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

    try {
      this.item = JSON.parse(item, ((key, value) => {
        // mapping big number values with ethers utils
        if (typeof value === 'object' && value.type === 'BigNumber') {
          return BigNumber.from(value)
        }
        return value
      })) as any
    } catch (e) {
      Logger.info("ERROR", e)
    }

    this.borrowLimit = borrowLimit
    this.totalBorrow = totalBorrow
    this.isDeposit = isDeposit

    if (this.ethAccount) {
      const isEth = await isEther(this.item.cToken);

      this.comptroller = new Comptroller(this.ethAccount);

      this.tokenContract = new Token(
        this.item.token,
        this.item.cToken,
        this.ethAccount,
        isEth
      );

      this.cTokenContract = new Ctoken(this.item.cToken, this.ethAccount, isEth);

      this.faucetContract = new FaucetToken(
        this.item.token,
        this.item.cToken,
        this.ethAccount,
        true
      );

      await Promise.all([this.estimateGasLimit(), this.getGasFee()])
    }

    this.isRefreshing = false
  }

  getValue = async (value: any) => {
    const tokenDecimals = this.isEther
      ? 18
      : await this.tokenContract.getDecimals();

    const decimals = Big(10).pow(+tokenDecimals);

    return Big(value)
      .times(decimals)
      .toFixed();
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
      this.gasEstimating = true
      // const result = await this.api.get<any>(GAS_FEE)

      const gasPrice = await getProviderStore.provider.getFeeData() as GasFeeData
      this.gasPrice = gasPrice.gasPrice

      // if (result.isOk) {
      //   this.fastGas = utils.parseUnits((result.data.fast / 10).toString(), 9)
      //   this.fastestGas = utils.parseUnits((result.data.fastest / 10).toString(), 9)
      //   this.safeLowGas = utils.parseUnits((result.data.safeLow / 10).toString(), 9)
      // }
    } catch (e) {
      Logger.log("GAS Error", e)
    } finally {
      this.gasEstimating = false
    }
  }

  estimateGasLimit = async () => {
    try {
      this.gasLimit = await this.cTokenContract.estimateGas(this.item.cToken, 1)
    } catch (e) {
      Logger.info(e)
    }
  }
}