import React, {useCallback, useEffect} from "react"
import {TransactionViewModel} from "./TransactionViewModel"
import {withStore} from "utils/hoc"
import {observer} from "mobx-react"
import {Header} from "components/header/Header"
import {useLocation, useNavigate} from "react-router-dom"
import {Loader} from "components/loader/Loader"
import {icons} from "utils/icons"
import {View, ViewDirections} from "components/ui/view/View"
import {Text} from "components/ui/text/Text"
import {ReactComponent as MaxIcon} from "assets/icons/ic_max.svg"
import {ReactComponent as ChangeIcon} from "assets/icons/ic_change.svg"
import {ReactComponent as ArrowRightIcon} from "assets/icons/ic_arrow_right.svg"
import {Button} from "components/ui/button/Button"
import {t} from "translations/translate"
import {Divider} from "components/ui/divider/Divider"
import {formatToCurrency} from "utils/utils"
import "./Transaction.style.sass"

export type TransactionState = {
  item: string
  isDeposit: boolean
  borrowLimit: number
  totalBorrow: number
}

export interface TransactionProps {
  view: TransactionViewModel;
}

const TransactionImpl: React.FC<TransactionProps> = ({view}) => {
  const navigate = useNavigate()
  const {state} = useLocation()

  const onClose = useCallback(() => {
    navigate(-1)
  }, [navigate])

  useEffect(() => {
    (async () => {
      await view.mounted(state as TransactionState)
    })()
  }, [state, view])

  if (view.isRefreshing) return <Loader/>

  return (
    <>
      <div className="valuation">
        <Header title={view.getTitle} onClose={onClose}/>
        <div className="valuation-content">
          <div className={`v-supply`}>
            <div className="v-supply-content">
              <img
                src={icons[view.item.symbol]}
                alt="logo"
                className="v-supply--avatar"
              />
              <View
                className="v-supply-content--right"
                direction={ViewDirections.COLUMN}>
                <View className="v-supply-content--row">
                  <Text className="v-supply-content--row-title" text={view.item.name}/>
                  <Text
                    className="v-supply-content--row-title"
                    text={view.getTokenUsdValue}
                  />
                </View>
                <View className="v-supply-content-row-second">
                  <Text className="v-supply-content-row-second-title" text={view.getTokenSymbol}/>
                  <Text className="v-supply-content-row-second-title" text={view.getTokenBalance}/>
                </View>
              </View>
            </div>
            {!view.isEnoughBalance && <>
              <Divider/>
              <span className="v-supply-insufficient-balance">{t("transaction.insufficientBalance")}</span>
            </>}
          </div>

          <div className="v-form">
            <span className="v-form-title">{view.getTokenOrFiat}</span>
            <div className="v-form-middle-row">
              <div onClick={view.setMaxValue} className="v-form-icon-container">
                <MaxIcon width={32} height={32} className="v-form-icon-container-icon"/>
              </div>
              <input
                inputMode="decimal"
                style={{
                  fontSize: view.getInputFontSize
                }}
                autoFocus
                className="v-form-middle-row-input"
                placeholder="0"
                value={view.getInputValue}
                onChange={(e) => view.setInputValue(e.target.value)}/>
              <div onClick={view.onSwap} className="v-form-icon-container">
                <ChangeIcon width={23} height={23} className="v-form-icon-container-icon"/>
              </div>
            </div>
            <span className="v-form-title">{view.getFiatOrTokenInput}</span>
            <Button
              loading={view.gasEstimating}
              className="fee-btn"
              text={view.getTransactionFiatFee}/>
            <div className="v-form-row">
              <span className="v-form-row-title">{`${t("home.deposit")} ${t("home.netApy")}`}</span>
              <span className="v-form-row-value">{view.getDepositPerYear}</span>
            </div>
            <div className="v-form-row">
              <span className="v-form-row-title">{t("home.borrowLimit")}</span>
              <div className="v-form-arrow-row">
                <span className="v-form-row-value">{view.getBorrowLimit}</span>
                {
                  view.newBorrowLimit !== 0 && <>
                    <ArrowRightIcon width={19} height={16} className="arrow-icon"/>
                    <span className="v-form-row-value">{formatToCurrency(view.newBorrowLimit)}</span>
                  </>
                }
              </div>
            </div>
            <div className="valuation-borrow-limit">
              <div className="valuation-borrow-limit-row">
                <span className="valuation-borrow-limit-row-title">{t("home.borrowLimitUsed")}</span>
                <span className="valuation-borrow-limit-row-value">{view.getBorrowLimitUsed}</span>
              </div>
              <div className="valuation-borrow-limit-progress">
                <div
                  className="valuation-borrow-limit-progress-child"
                  style={{width: `${view.borrowLimitUsed}%`}}
                />
              </div>
            </div>
            <Button
              className="v-form-btn"
              onClick={view.handleButtonClick}
              disabled={view.isButtonDisabled}
              text={view.getDepositButtonText}/>

            <div className="v-wallet-balance">
              <span className="v-wallet-balance-title">{t("home.walletBalance")}</span>
              <span className="v-wallet-balance-value">{view.getFormattedBalance}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const Transaction = withStore(TransactionViewModel, observer(TransactionImpl))