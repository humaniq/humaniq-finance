import React from "react";
import { View, ViewDirections } from "../../ui/view/View";
import { Text } from "../../ui/text/Text";
import { Divider } from "../../ui/divider/Divider";
import { Button } from "../../ui/button/Button";
import { t } from "translations/translate";
import { BorrowSupplyItem } from "models/types";
import Big from "big.js";
import "./SupplyItem.style.sass";
import { icons } from "utils/icons";

export interface TokenItemProps {
  onClick?: () => void;
  onButtonClick?: () => void;
  className?: string;
  disabled?: boolean;
  insufficientBalance?: boolean;
  item: BorrowSupplyItem;
}

export const SupplyItem: React.FC<TokenItemProps> = ({
  onClick,
  onButtonClick,
  className,
  disabled,
  insufficientBalance = false,
  item,
  ...rest
}) => {
  return (
    <div onClick={onClick} className={`supply-item ${className}`} {...rest}>
      <div className="supply-item--content">
        <img
          src={icons[item.symbol]}
          alt="logo"
          className="supply-item--avatar"
        />
        <View
          className="supply-item--content--right"
          direction={ViewDirections.COLUMN}
        >
          <View className="supply-item--content--row">
            <Text className="title" text={item.name} />
            <Text
              className="title"
              text={`$${item.tokenUsdValue.toFixed(2)}`}
            />
          </View>
          <View className="row-2">
            <Text className="title" text={item.symbol} />
            <Text className="title" text={`${Big(item.balance).toFixed(2)}`} />
          </View>
          <Divider marginT={10} />
          <Button
            disabled={disabled}
            className="token-button"
            onClick={onButtonClick}
            text={`Deposit ${item.supplyApy}%`}
          />
          {insufficientBalance && (
            <>
              <Divider marginT={10} />
              <span className="insufficient">{t("insufficientBalance")}</span>
            </>
          )}
        </View>
      </div>
    </div>
  );
};
