import React, {useMemo} from "react"
import {Text} from "../../ui/text/Text"
import {Divider} from "../../ui/divider/Divider"
import {Button} from "../../ui/button/Button"
import {BorrowSupplyItem} from "models/types"
import Big from "big.js"
import "./BorrowItem.style.sass"
import {icons} from "utils/icons"
import {t} from "translations/translate"

export interface BorrowItemProps {
  onBorrowClick?: () => void;
  className?: string;
  disabled?: boolean;
  item: BorrowSupplyItem;
  isRepay?: boolean
}

export const BorrowItem: React.FC<BorrowItemProps> = ({
                                                        onBorrowClick,
                                                        className,
                                                        disabled,
                                                        item,
                                                        isRepay = false,
                                                        ...rest
                                                      }) => {
  const buttonDisabled = useMemo(() => {
    return disabled || !isRepay && item.supply > 0
  }, [disabled])

  const subTitle = useMemo(() => {
    return Big(isRepay ? item.borrow : item.balance).toFixed(2)
  }, [item, isRepay])

  const title = useMemo(() => {
    let text

    if (isRepay) {
      text = Big(item.tokenUsdValue).mul(item.borrow).toFixed(2)
    } else {
      text = item.tokenUsdValue.toFixed(2)
    }

    return `$${text}`
  }, [item, isRepay])

  const buttonTitle = useMemo(() => {
    let text

    if (isRepay) {
      text = t("transaction.repay")
    } else {
      text = t("home.borrow")
    }

    return `${text} ${item.borrowApy}%`
  }, [isRepay, t])

  return (
    <div className={`borrow-item ${className}`} {...rest}>
      <div className="borrow-item--content">
        <img
          src={icons[item.symbol]}
          alt="logo"
          className="borrow-item--avatar"
        />
        <div className="borrow-item--content--right">
          <div className="borrow-item--content--row">
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
            className={`token-button repay`}
            onClick={onBorrowClick}
            text={buttonTitle}
          />
        </div>
      </div>
    </div>
  )
}
