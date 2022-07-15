import React from "react"
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
              text={`$${isRepay ? Big(item.tokenUsdValue).mul(item.borrow).toFixed(2) : item.tokenUsdValue.toFixed(2)}`}
            />
          </div>
          <div className="row-2">
            <Text className="title" text={item.symbol}/>
            <Text className="title" text={`${Big(isRepay ? item.borrow : item.balance).toFixed(2)}`}/>
          </div>
          <Divider marginT={10}/>
          <Button
            disabled={disabled}
            className={`token-button ${isRepay ? "repay" : ""}`}
            onClick={onBorrowClick}
            text={isRepay ? `${t("transaction.repay")}` : `${t("home.borrow")} ${item.borrowApy}%`}
          />
        </div>
      </div>
    </div>
  )
}
