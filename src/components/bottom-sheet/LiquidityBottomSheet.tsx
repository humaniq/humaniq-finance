import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Text } from "../ui/text/Text";
import colors from "../../utils/colors";
import { useTranslation } from "react-i18next";
import { LiquidityTokenItem } from "../main/liquidity/LiquidityTokenItem";

import "./LiquidityBottomSheet.style.sass";

export interface LiquidityBottomSheetProps {
  list: any[];
  visible: boolean;
  setVisible: () => void;
}

export const LiquidityBottomSheet: React.FC<LiquidityBottomSheetProps> = ({
  list = [],
  visible,
  setVisible,
}) => {
  const { t } = useTranslation();

  return (
    <BottomSheet
      open={visible}
      className="liquidity-sheet-container"
      onDismiss={setVisible}
    >
      <div className="liquidity-sheet-content">
        <Text
          size={16}
          className="label"
          color={colors.blackText}
          text={t("main.liquidity")}
        />
        <div className="list">
          {list.map((item, index) => (
            <LiquidityTokenItem
              key={`liquidity_item_${item.id}_${index}`}
              title={item.title}
              subTitle={item.coin}
              amount={item.amountUSD}
              subAmount={item.amountCOIN}
            />
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};
