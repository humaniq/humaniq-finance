import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Text } from "../ui/text/Text";
import colors from "../../utils/colors";
import { TokenItem } from "../main/token/TokenItem";
import { useTranslation } from "react-i18next";
import "./LiquidityBottomSheet.style.sass";
import { LiquidityTokenItem } from "../main/liquidity/LiquidityTokenItem";

export interface LiquidityBottomSheetProps {
  list: any[];
}

export const LiquidityBottomSheet: React.FC<LiquidityBottomSheetProps> = ({
  list = [],
}) => {
  const { t } = useTranslation();

  return (
    <BottomSheet open={true} header={<div></div>}>
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
