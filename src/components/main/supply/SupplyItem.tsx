import React from "react"
import {Text} from "../../ui/text/Text"
import {Divider} from "../../ui/divider/Divider"
import {Button} from "../../ui/button/Button"
import {BorrowSupplyItem} from "models/types"
import Big from "big.js"
import {icons} from "utils/icons"
import "./SupplyItem.style.sass"
import {t} from "translations/translate"

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

export const SupplyItem: React.FC<TokenItemProps> = ({
                                                       onSupplyClick,
                                                       className,
                                                       disabled,
                                                       item,
                                                       isWithdraw = false,
                                                       isBalance = false,
                                                       ...rest
                                                     }) => {
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
              text={`$${isWithdraw || isBalance ? Big(item.tokenUsdValue).mul(isBalance ? item.balance : item.supply).toFixed(2) : item.tokenUsdValue.toFixed(2)}`}
            />
          </div>
          <div className="row-2">
            <Text className="title" text={item.symbol}/>
            <Text className="title" text={`${Big(isWithdraw ? item.supply : item.balance).toFixed(2)}`}/>
          </div>
          <Divider marginT={10}/>
          <Button
            disabled={disabled || +item.balance === 0}
            className="token-button"
            onClick={onSupplyClick}
            text={isWithdraw ? `${t("transaction.withdraw")}` : `${t("home.deposit")} ${item.supplyApy}%`}
          />
        </div>
      </div>
    </div>
  )
}
