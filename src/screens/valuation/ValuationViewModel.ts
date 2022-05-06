import {makeAutoObservable} from "mobx"
import {BorrowSupplyItem} from "models/types"
import {t} from "translations/translate"
import {Logger} from "utils/logger"
import Big from "big.js"
import {formatToCurrency, formatToNumber} from "utils/utils"
import {BigNumber} from "ethers"
import {ValuationState} from "screens/valuation/Valuation"
import {isEmpty} from "utils/textUtils"
import {Token} from "models/Token"
import {getProviderStore} from "App"
import {isEther} from "models/ContractsAPI"
import {Comptroller} from "models/Comptroller"
import {Ctoken} from "models/CToken"
import {FaucetToken} from "models/FaucetToken"
import {ERC20Contract} from "models/contracts/ERC20Contract"

export class ValuationViewModel {
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
  cTokenContract: any
  faucetContract: any

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true})
    this.ethAccount = getProviderStore.currentAccount
  }

  get isEnoughBalance() {
    return this.isSwap ? Big(this.item.tokenUsdValue).gte(+this.getInputValue) : Big(this.item.balance).gte(+this.getInputValue)
  }

  get getInputFontSize() {
    return this.getInputValue.length < 8
      ? "50px"
      : "32px"
  }

  get getTokenSymbol() {
    return this.item.symbol
  }

  get getTitle() {
    return `${t(this.isDeposit ? "main.deposit" : "main.borrow")} ${this.getTokenSymbol}`
  }

  get getTokenBalance() {
    return `${Big(this.item.balance).toFixed(2)}`
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
    return this.inputValue.replace(/^\D+\.?\D*$/, '')
  }

  get newBorrowLimit() {
    if (!this.getInputValue) return 0
    if (!this.item.isEnteredTheMarket) return this.borrowLimit

    return this.borrowLimit + (this.isSwap ? this.inputValueToken : this.inputValueFiat) * this.collateralMantissa
  }

  get collateralMantissa() {
    return this.item.collateralFactorMantissa / 1e18
  }

  get inputValueFiat() {
    if (!this.getInputValue) return 0

    return parseFloat(this.getInputValue) * this.item.tokenUsdValue
  }

  get inputValueToken() {
    if (!this.getInputValue) return 0

    return parseFloat(this.getInputValue) / this.item.tokenUsdValue
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
    return `${t(this.isDeposit ? "main.deposit" : "main.borrow")} ${formatToCurrency(this.inputValueFiat)}`
  }

  handleButtonClick = async () => {
    let gas = 0;
    // const inputValue = this.isMaxValueSet ? this.balance : this.inputValue;
    const inputValue = this.inputValue;
    let supplyValue = await this.getValue(inputValue);

    // this.setTransactionModal({
    //   title: "Confirm Transaction",
    //   message: "Confirm the transaction"
    // });

    // if (this.isEther && this.isMaxValueSet) {
    //   const gasPrice = await web3.eth.getGasPrice();
    //
    //   gas = await web3.eth.estimateGas({
    //     from: this.ethAccount,
    //     to: this.cToken,
    //     data: "0x1249c58b",
    //     value: supplyValue
    //   });
    //
    //   const fee = gas * gasPrice;
    //   supplyValue = Big(supplyValue).minus(fee);
    // }

    const contract = ERC20Contract(this.item.token, getProviderStore.provider)

    if (this.isEther) {
    }

    // this.cTokenContract
    //   .supply(supplyValue, gas)
    //   .on("error", this.onTransactionError)
    //   .on("transactionHash", async hash => {
    //     this.onTransactionConfirm();
    //     await this.comptroller.waitForTransaction(hash);
    //     this.onTransactionConfirmed();
    //   })
    //   .catch(() => {
    //     this.closeModal();
    //   });
  }

  setInputValue = (value: string) => {
    this.inputValue = value
  }

  mounted = async (state: ValuationState) => {
    const {isDeposit, item, borrowLimit, totalBorrow} = state

    try {
      this.item = JSON.parse(item, ((key, value) => {
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
    let maxValue = this.item.balance

    if (this.isSwap) {
      maxValue = this.item.tokenUsdValue
    }
    this.setInputValue(String(maxValue))
  }

  onSwap = () => {
    this.isSwap = !this.isSwap
  }
}