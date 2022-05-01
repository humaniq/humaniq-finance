import React from "react";
import { Text } from "../ui/text/Text";
import colors from "../../utils/colors";
import { InfoButton, PLACEMENT } from "../info-button/InfoButton";
import { Button } from "../ui/button/Button";
import { HintMessage } from "../ui/hint/HintMessage";
import { useTranslation } from "react-i18next";
import { BorrowItem } from "components/main/borrow/BorrowItem";
import { BorrowSupplyItem } from "models/types";
import "./Borrows.style.sass";

export interface BorrowsProps {
  list: BorrowSupplyItem[];
  onPress?: () => void;
}

export const Borrows: React.FC<BorrowsProps> = ({ list, onPress }) => {
  const { t } = useTranslation();

  return (
    <div className="available-borrow">
      <div className="title-container">
        <div className="title">
          <Text
            className="label"
            size={16}
            text={t("main.availableToBorrow")}
            color={colors.blackText}
          />
          <InfoButton
            message={t("hints.borrowAvailable")}
            placement={PLACEMENT.BOTTOM}
            color={colors.blackText}
          />
        </div>
        <Button
          onClick={onPress}
          className="liquidity-btn"
          text={t("main.liquidity")}
        />
      </div>
      <HintMessage message={t("main.borrowHint")} />
      <div className="list">
        {list.map((item, index) => (
          <BorrowItem key={`borrow_item_${item.symbol}_${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};
