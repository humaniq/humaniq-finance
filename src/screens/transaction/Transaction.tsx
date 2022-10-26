import React, {useEffect, useRef} from "react"
import {TransactionViewModel} from "./TransactionViewModel"
import {withStore} from "utils/hoc"
import {observer} from "mobx-react"
import {Header} from "components/header/Header"
import {useNavigate} from "react-router-dom"
import {Loader} from "components/loader/Loader"
import {icons} from "utils/icons"
import {Text} from "components/ui/text/Text"
import {ReactComponent as MaxIcon} from "assets/icons/ic_max.svg"
import {ReactComponent as ChangeIcon} from "assets/icons/ic_change.svg"
import {ReactComponent as ArrowRightIcon} from "assets/icons/ic_arrow_right.svg"
import {Button} from "components/ui/button/Button"
import {t} from "translations/translate"
import {Divider} from "components/ui/divider/Divider"
import {useSharedData} from "hooks/useSharedData"
import {BorrowSupplyItem} from "models/types"
import AutosizeInput from 'react-input-autosize'
import "./Transaction.style.sass"
import {TransactionLinearProgress} from "components/ui/progress/transaction/TransactionLinearProgress"
import {TRANSACTION_TYPE} from "models/contracts/types"
import colors from "utils/colors"
import {getProviderStore} from "App"
import {isEmpty} from "utils/textUtils"

export type TransactionState = {
  item: BorrowSupplyItem
  transactionType: TRANSACTION_TYPE
  borrowLimit: number
  totalBorrow: number
  totalDeposit: number
}

export interface TransactionProps {
  view: TransactionViewModel;
}

const TransactionImpl: React.FC<TransactionProps> = ({view}) => {
  const navigate = useNavigate()
  const {data, setData} = useSharedData()
  const inputRef = useRef<HTMLInputElement & AutosizeInput | null>(null)

  useEffect(() => {
    ;(async () => {
      if (data) {
        await view.mounted(data as TransactionState)
        view.setInputRef(inputRef.current)
        view.setNavigation(navigate)
      }
    })()

    return () => {
      setData(null)
      view.unMounted()
    }
  }, [view, data, setData, navigate])

  if (!data) return null

  if (view.isRefreshing || getProviderStore.isConnecting) return <Loader visible={view.isRefreshing || getProviderStore.isConnecting} color={
    (data as TransactionState).transactionType === TRANSACTION_TYPE.REPAY ||
    (data as TransactionState).transactionType === TRANSACTION_TYPE.BORROW ? colors.purpleHeart : colors.primary
  }/>

  return (
    <>
      <div className="valuation">
        <Header title={view.getTitle} onClose={view.navigateBack}/>
        <div className="valuation-content">
          <div className={`v-supply`}>
            <div className="v-supply-content">
              <img
                src={icons[view.item.symbol]}
                alt="logo"
                className="v-supply--avatar"
              />
              <div
                className="v-supply-content--right">
                <div className="v-supply-content--row">
                  <Text className="v-supply-content--row-title" text={view.item.name}/>
                  <Text
                    className="v-supply-content--row-title"
                    text={view.tokenFiatDisplay}
                  />
                </div>
                <div className="v-supply-content-row-second">
                  <Text className="v-supply-content-row-second-title" text={view.getTokenSymbol}/>
                  <Text className="v-supply-content-row-second-title" text={view.tokenBalanceDisplay}/>
                </div>
              </div>
            </div>
            {!view.isEnoughBalance && <>
              <Divider/>
              <span className="v-supply-insufficient-balance">{t("transaction.insufficientBalance")}</span>
            </>}
          </div>
          <div className="v-form">
            <span className="v-form-title">{view.getTokenOrFiat}</span>
            <div className="v-form-middle-row">
              <div aria-label="max-button" onClick={view.setMaxValue} className="v-form-icon-container">
                <MaxIcon width={30} height={30} className="v-form-icon-container-icon"/>
              </div>
              <AutosizeInput
                aria-label="cost-input"
                ref={inputRef}
                inputMode="decimal"
                inputStyle={{
                  fontSize: view.getInputFontSize
                }}
                autoFocus
                inputClassName="v-form-middle-row-input"
                placeholder="0"
                value={view.getInputValue}
                onChange={(e) => view.setInputValue(e.target.value)}/>
              <div aria-label="swap-button" onClick={view.onSwap} className="v-form-icon-container">
                <ChangeIcon width={22} height={22} className="v-form-icon-container-icon"/>
              </div>
            </div>
            <span className="v-form-title">{view.getFiatOrTokenInput}</span>
            <Button
              loading={view.gasEstimating}
              className="fee-btn"
              text={view.getTransactionFiatFee}/>
            <div className="v-form-row">
              <span className="v-form-row-title">{view.getApyTitle}</span>
              <span className="v-form-row-value">{view.getApyValue}</span>
            </div>
            <div className="borrow-section">
              <div className="row">
                <span className="title">{view.getBorrowLimitTitle}</span>
                <div className="right">
                  <span className="value">{view.getBorrowLimitValue}</span>
                  {
                    !isEmpty(view.inputValue) && <>
                      <ArrowRightIcon width={19} height={16} className="arrow-icon"/>
                      <span className="value">{view.getNewBorrowLimit}</span>
                    </>
                  }
                </div>
              </div>
              <div className="row">
                <span className="title">{t("home.borrowLimitUsed")}</span>
                <div className="row">
                  <span className="value">{view.getBorrowLimitUsedValue}</span>
                  {
                    !isEmpty(view.inputValue) && <>
                      <ArrowRightIcon width={19} height={16} className="arrow-icon"/>
                      <span className="value">{view.getNewBorrowLimitUsedFormatted}</span>
                    </>
                  }
                </div>
              </div>
              <TransactionLinearProgress progress={view.maxBorrowLimitUsed}/>
            </div>
          </div>
        </div>
        <Button
          className={`pay-button ${view.buttonColor}`}
          onClick={view.handleTransaction}
          disabled={view.isButtonDisabled}
          text={view.getDepositButtonText}/>
      </div>
    </>
  )
}

export const Transaction = withStore(TransactionViewModel, observer(TransactionImpl))
