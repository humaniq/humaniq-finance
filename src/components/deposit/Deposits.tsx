import React from "react"
import {Text} from "../ui/text/Text"
import colors from "../../utils/colors"
import {InfoButton, PLACEMENT} from "../info-button/InfoButton"
import "./Deposits.style.sass"
import {SupplyItem} from "components/main/supply/SupplyItem"
import {BorrowSupplyItem} from "models/types"
import {TRANSACTION_TYPE} from "models/contracts/types"

export interface DepositsProps {
  data: BorrowSupplyItem[]
  onClick?: (item: BorrowSupplyItem, type: TRANSACTION_TYPE) => void
  title: string
  hintText: string
  isWithdraw?: boolean
  isBalance?: boolean
}

export const Deposits: React.FC<DepositsProps> = ({
                                                    data = [],
                                                    onClick,
                                                    title,
                                                    hintText,
                                                    isWithdraw = false,
                                                    isBalance = false
                                                  }) => {
  return (
    <div className="deposits">
      <div className="title">
        <Text
          size={16}
          className="label"
          color={colors.blackText}
          text={title}
        />
        <InfoButton
          message={hintText}
          placement={PLACEMENT.BOTTOM}
          color={colors.blackText}
        />
      </div>
      <div className="deposits--list">
        {data.map((item, index) => (
          <SupplyItem
            isBalance={isBalance}
            isWithdraw={isWithdraw}
            onSupplyClick={() => onClick?.(item, isWithdraw ? TRANSACTION_TYPE.WITHDRAW : TRANSACTION_TYPE.DEPOSIT)}
            key={`supply_item_${item.symbol}_${index}`}
            item={item}/>
        ))}
      </div>
    </div>
  )
}
