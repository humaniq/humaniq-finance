import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { useTranslation } from "react-i18next";
import colors from "utils/colors"
import {Text} from "components/ui/text/Text"
import "./TransactionFeeBottomSheet.style.sass";

export interface TransactionFeeBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
}

export const TransactionFeeBottomSheet: React.FC<TransactionFeeBottomSheetProps> = ({
  visible,
  onDismiss,
}) => {
  const { t } = useTranslation();

  return (
    <BottomSheet
      open={visible}
      className="transaction-fee-sheet-container"
      onDismiss={onDismiss}
    >
      <div className="transaction-fee-sheet-content">
        <Text
          size={16}
          className="transaction-fee-sheet-content-label"
          color={colors.blackText}
          text={t("home.liquidity")}
        />
      </div>
    </BottomSheet>
  );
};