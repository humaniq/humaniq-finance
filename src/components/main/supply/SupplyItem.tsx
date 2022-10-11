import React, { useMemo } from "react"
import { Text } from "../../ui/text/Text"
import { Divider } from "../../ui/divider/Divider"
import { Button } from "../../ui/button/Button"
import { BorrowSupplyItem } from "models/types"
import Big from "big.js"
import { icons } from "utils/icons"
import "./SupplyItem.style.sass"
import { t } from "translations/translate"
import { MIN_VALUE } from "utils/common"

export enum COLLATERAL_STATUS {
  ENTERED_MARKET,
  EXITED_MARKET
}

export interface TokenItemProps {
  onSupplyClick?: () => void
  className?: string
  disabled?: boolean
  item: BorrowSupplyItem
  isWithdraw?: boolean
  isBalance?: boolean
}

export const SupplyItem = ({
                             onSupplyClick,
                             className,
                             disabled,
                             item,
                             isWithdraw = false,
                             isBalance = false,
                             ...rest
                           }: TokenItemProps) => {

  const buttonDisabled = useMemo(() => {
    return disabled || (!isWithdraw && Big(item.tokenUsdValue).mul(item.balance).lte(MIN_VALUE))
  }, [item, disabled, isWithdraw])

  const title = useMemo(() => {
    let text

    if (isWithdraw || isBalance) {
      text = Big(item.tokenUsdValue).mul(isBalance ? item.balance : item.supply).toFixed(2)
    } else {
      text = item.tokenUsdValue.toFixed(2)
    }

    return `$${text}`
  }, [item, isWithdraw, isBalance])

  const buttonTitle = useMemo(() => {
    let text
    if (isWithdraw) {
      text = t("transaction.withdraw")
    } else {
      text = `${t("home.deposit")} ${item.supplyApy}%`
    }
    return text
  }, [item, isWithdraw, t])

  const subTitle = useMemo(() => {
    return Big(isWithdraw ? item.supply : item.balance).toFixed(2)
  }, [item, isWithdraw])

  return (
    <div className={`supply-item ${className}`} {...rest}>
      <div className="supply-item--content">
        <img
          src={icons[item.symbol]}
          alt="logo"
          className="supply-item--avatar"
        />
        <div
          className="supply-item--content--right"
        >
          <div className="supply-item--content--row">
            <Text className="title" text={item.name}/>
            <Text
              className="title"
              text={title}
            />
          </div>
          <div className="row-2">
            <Text className="title" text={item.symbol}/>
            <Text className="title" text={subTitle}/>
          </div>
          <Divider marginT={10}/>
          <Button
            disabled={buttonDisabled}
            className="token-button"
            onClick={onSupplyClick}
            text={buttonTitle}
          />
        </div>
      </div>
    </div>
  )
}
