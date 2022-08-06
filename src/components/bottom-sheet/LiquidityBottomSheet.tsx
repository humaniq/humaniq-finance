import React from "react"
import {BottomSheet} from "react-spring-bottom-sheet"
import {Text} from "../ui/text/Text"
import colors from "../../utils/colors"
import {LiquidityTokenItem} from "../main/liquidity/LiquidityTokenItem"
import "./LiquidityBottomSheet.style.sass"
import {t} from "translations/translate"

export interface LiquidityBottomSheetProps {
  list: any[];
  visible: boolean;
  onDismiss: () => void;
}

export const LiquidityBottomSheet = ({
                                       list = [],
                                       visible,
                                       onDismiss
                                     }: LiquidityBottomSheetProps) => {
  return (
    <BottomSheet
      open={visible}
      className="liquidity-sheet-container"
      onDismiss={onDismiss}
    >
      <div className="liquidity-sheet-content">
        <Text
          size={16}
          className="label"
          color={colors.blackText}
          text={t("home.liquidity")}
        />
        <div className="list">
          {list.map((item, index) => (
            <LiquidityTokenItem
              key={`liquidity_item_${item.id}_${index}`}
              item={item}
            />
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}
