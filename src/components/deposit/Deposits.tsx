import React from "react";
import { Text } from "../ui/text/Text";
import colors from "../../utils/colors";
import { InfoButton, PLACEMENT } from "../info-button/InfoButton";
import { TokenItem } from "../main/token/TokenItem";
import { useTranslation } from "react-i18next";
import "./Deposits.style.sass";

export interface DepositsProps {
  list: any[];
}

export const Deposits: React.FC<DepositsProps> = ({ list }) => {
  const { t } = useTranslation();

  return (
    <div className="deposits">
      <div className="title">
        <Text
          size={16}
          className="label"
          color={colors.blackText}
          text={t("deposits.title")}
        />
        <InfoButton
          message={t("hints.balance")}
          placement={PLACEMENT.BOTTOM}
          color={colors.blackText}
        />
      </div>
      <div className="list">
        {list.map((item, index) => (
          <TokenItem
            key={`deposit_item_${item.id}_${index}`}
            title={item.title}
            subTitle={item.coin}
            amount={item.amountUSD}
            subAmount={item.amountCOIN}
          />
        ))}
      </div>
    </div>
  );
};
