import React, {useCallback, useEffect} from "react"
import {ValuationViewModel} from "./ValuationViewModel"
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
import "./Valuation.style.sass"

export type ValuationState = {
  item: string
  isDeposit: boolean
  borrowLimit: number
  totalBorrow: number
}

export interface ValuationProps {
  view: ValuationViewModel;
}

const ValuationImpl: React.FC<ValuationProps> = ({view}) => {
  const navigate = useNavigate()
  const {state} = useLocation()

  const onClose = useCallback(() => {
    navigate(-1)
  }, [navigate])

  useEffect(() => {
    (async () => {
      await view.mounted(state as ValuationState)
    })()
  }, [state, view])

  if (view.isRefreshing) return <Loader/>

  return (
    <div className="valuation">
      <Header title={view.getTitle} onClose={onClose}/>
      <div className="valuation--content">
        <div className={`v-supply-item`}>
          <div className="v-supply-item--content">
            <img
              src={icons[view.item.symbol]}
              alt="logo"
              className="v-supply-item--avatar"
            />
            <View
              className="v-supply-item--content--right"
              direction={ViewDirections.COLUMN}>
              <View className="v-supply-item--content--row">
                <Text className="v-supply-item--content--row-title" text={view.item.name}/>
                <Text
                  className="v-supply-item--content--row-title"
                  text={view.getTokenUsdValue}
                />
              </View>
              <View className="v-supply-item--content-row-second">
                <Text className="v-supply-item--content-row-second-title" text={view.getTokenSymbol}/>
                <Text className="v-supply-item--content-row-second-title" text={view.getTokenBalance}/>
              </View>
            </View>
          </div>
          {!view.isEnoughBalance && <>
            <Divider/>
            <span className="v-supply-item-insufficient-balance">{t("insufficientBalance")}</span>
          </>}
        </div>

        <div className="calc-form">
          <span className="title">{view.getTokenOrFiat}</span>
          <div className="calc-form-middle-row">
            <div onClick={view.setMaxValue} className="calc-icon-container">
              <MaxIcon width={32} height={32} className="calc-icon"/>
            </div>
            <input
              style={{
                fontSize: view.getInputFontSize
              }}
              className="calc-form-middle-row-input"
              placeholder="0"
              value={view.getInputValue}
              onChange={event => view.setInputValue(event.target.value)}/>
            <div onClick={view.onSwap} className="calc-icon-container">
              <ChangeIcon width={26} height={26}/>
            </div>
          </div>
          <span className="title">{view.getFiatOrTokenInput}</span>
          <Button className="fee-btn" text="Slow fee $10.00"/>
          <div className="calc-form-row">
            <span className="title">{`${t("main.deposit")} ${t("main.netApy")}`}</span>
            <span className="value">{view.getDepositPerYear}</span>
          </div>
          <div className="calc-form-row">
            <span className="title">{t("main.borrowLimit")}</span>
            <div className="calc-form-arrow-row">
              <span className="value">{view.getBorrowLimit}</span>
              {view.newBorrowLimit !== 0 && <>
                <ArrowRightIcon width={20} height={20} className="arrow-icon"/>
                <span className="value">{formatToCurrency(view.newBorrowLimit)}</span>
              </>}
            </div>
          </div>
          <div className="valuation-borrow-limit">
            <div className="valuation-borrow-limit-row">
              <span className="title">{t("main.borrowLimitUsed")}</span>
              <span className="value">{view.getBorrowLimitUsed}</span>
            </div>
            <div className="valuation-borrow-limit-progress">
              <div
                className="valuation-borrow-limit-progress-child"
                style={{width: `${view.borrowLimitUsed}%`}}
              />
            </div>
          </div>
          <Button
            className="calc-form-btn"
            onClick={view.handleButtonClick}
            disabled={view.isButtonDisabled}
            text={view.getDepositButtonText}/>
        </div>
      </div>
    </div>
  )
}

export const Valuation = withStore(ValuationViewModel, observer(ValuationImpl))