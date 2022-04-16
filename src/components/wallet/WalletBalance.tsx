import React from "react";
import { Text } from "../ui/text/Text";
import colors from "../../utils/colors";
import { InfoButton, PLACEMENT } from "../info-button/InfoButton";
import { TokenItem } from "../main/token/TokenItem";
import { useTranslation } from "react-i18next";
import "./WalletBalance.style.sass";

export interface WalletBalanceProps {
  list: any[];
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ list }) => {
  const { t } = useTranslation();

  return (
    <div className="wallet-balance">
      <div className="title">
        <Text
          size={16}
          className="label"
          color={colors.blackText}
          text={t("main.walletBalance")}
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
            key={`token_item_${item.id}_${index}`}
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
