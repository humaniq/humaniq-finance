import React from "react"
import {Text} from "../ui/text/Text"
import colors from "../../utils/colors"
import {InfoButton, PLACEMENT} from "../info-button/InfoButton"
import {Button} from "../ui/button/Button"
import {HintMessage} from "../ui/hint/HintMessage"
import {BorrowItem} from "components/main/borrow/BorrowItem"
import {BorrowSupplyItem} from "models/types"
import "./Borrows.style.sass"
import {t} from "translations/translate"

export interface BorrowsProps {
  data: BorrowSupplyItem[];
  onClick?: (item: BorrowSupplyItem) => void
  onLiquidityClick?: () => void
  title: string
  infoText: string
  showLiquidityButton?: boolean
  hintMessage?: string
  isRepay?: boolean
  infoButtonBackgroundColor?: string
}

export const Borrows: React.FC<BorrowsProps> = ({
                                                  data,
                                                  onClick,
                                                  onLiquidityClick,
                                                  title,
                                                  infoText,
                                                  showLiquidityButton = true,
                                                  hintMessage,
                                                  isRepay = false,
                                                  infoButtonBackgroundColor
                                                }) => {
  return (
    <div className="available-borrow">
      <div className="title-container">
        <div className="title">
          <Text
            className="label"
            size={16}
            text={title}
            color={colors.blackText}
          />
          <InfoButton
            message={infoText}
            placement={PLACEMENT.BOTTOM}
            color={colors.blackText}
            backgroundColor={infoButtonBackgroundColor}
          />
        </div>
        {showLiquidityButton && (
          <Button
            className="liquidity-btn"
            text={t("home.liquidity")}
            onClick={onLiquidityClick}
          />
        )}
      </div>
      {hintMessage && (
        <HintMessage message={hintMessage}/>
      )}
      <div className="list">
        {data.map((item, index) => (
          <BorrowItem
            isRepay={isRepay}
            onBorrowClick={() => onClick?.(item)}
            key={`borrow_item_${item.symbol}_${index}`}
            item={item}/>
        ))}
      </div>
    </div>
  )
}
