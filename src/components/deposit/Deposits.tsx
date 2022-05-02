import React from "react";
import { Text } from "../ui/text/Text";
import colors from "../../utils/colors";
import { InfoButton, PLACEMENT } from "../info-button/InfoButton";
import { useTranslation } from "react-i18next";
import "./Deposits.style.sass";
import { SupplyItem } from "components/main/supply/SupplyItem";
import { BorrowSupplyItem } from "models/types";

export interface DepositsProps {
  list: BorrowSupplyItem[];
}

export const Deposits: React.FC<DepositsProps> = ({ list = [] }) => {
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
      <div className="deposits--list">
        {list.map((item, index) => (
          <SupplyItem key={`supply_item_${item.symbol}_${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};
