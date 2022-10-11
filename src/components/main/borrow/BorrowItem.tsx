import React, { useMemo } from "react"
import { Text } from "../../ui/text/Text"
import { Divider } from "../../ui/divider/Divider"
import { Button } from "../../ui/button/Button"
import { BorrowSupplyItem } from "models/types"
import Big from "big.js"
import { icons } from "utils/icons"
import { t } from "translations/translate"
import "./BorrowItem.style.sass"
import { MIN_VALUE } from "utils/common"

export interface BorrowItemProps {
  onBorrowClick?: () => void;
  className?: string;
  disabled?: boolean;
  item: BorrowSupplyItem;
  isRepay?: boolean
  isLiquidity?: boolean
  borrowLimit: number
  totalBorrow: number
  totalSupply: number
}

export const BorrowItem = ({
                             onBorrowClick,
                             className,
                             disabled,
                             item,
                             isRepay = false,
                             borrowLimit,
                             totalBorrow,
                             totalSupply,
                             isLiquidity,
                             ...rest
                           }: BorrowItemProps) => {
  const buttonDisabled = useMemo(() => {
    return disabled || (!isRepay && totalSupply <= MIN_VALUE)
  }, [disabled, isRepay, totalSupply])

  const subTitle = useMemo(() => {
    return Big(isRepay ? item.borrow : item.liquidity / item.tokenUsdValue).toFixed(2)
  }, [item, isRepay])

  const title = useMemo(() => {
    let text

    if (isRepay) {
      text = Big(item.fiatBorrow).toFixed(2)
    } else {
      text = item.liquidity.toFixed(2)
    }

    return `$${text}`
  }, [item, isRepay])

  const buttonTitle = useMemo(() => {
    let text

    if (isRepay) {
      text = t("transaction.repay")
    } else {
      text = `${t("home.borrow")} ${item.borrowApy}%`
    }

    return text
  }, [isRepay, t])

  return (
    <div className={`borrow-item ${className}`} {...rest}>
      <div className="inner">
        <img
          src={icons[item.symbol]}
          alt="logo"
          className="avatar"
        />
        <div className="right">
          <div className="row">
            <Text className="title" text={item.name}/>
            {!isLiquidity && (
              <Text
                className="title"
                text={title}
              />
            )}
          </div>
          <div className="row-2">
            <Text className="title" text={item.symbol}/>
            {!isLiquidity && (
              <Text className="title" text={subTitle}/>
            )}
          </div>
          <Divider marginT={10}/>
          <Button
            disabled={buttonDisabled}
            className={`token-button repay`}
            onClick={onBorrowClick}
            text={buttonTitle}
          />
        </div>
      </div>
    </div>
  )
}
