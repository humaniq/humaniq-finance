import React from "react";
import { View, ViewDirections } from "../../ui/view/View";
import { Text } from "../../ui/text/Text";
import { Divider } from "../../ui/divider/Divider";
import { Button } from "../../ui/button/Button";
import { BorrowSupplyItem } from "models/types";
import Big from "big.js";
import "./BorrowItem.style.sass";
import { icons } from "utils/icons";

export interface BorrowItemProps {
  onBorrowClick?: () => void;
  className?: string;
  disabled?: boolean;
  item: BorrowSupplyItem;
}

export const BorrowItem: React.FC<BorrowItemProps> = ({
  onBorrowClick,
  className,
  disabled,
  item,
  ...rest
}) => {
  return (
    <div className={`borrow-item ${className}`} {...rest}>
      <div className="borrow-item--content">
        <img
          src={icons[item.symbol]}
          alt="logo"
          className="borrow-item--avatar"
        />
        <View
          className="borrow-item--content--right"
          direction={ViewDirections.COLUMN}
        >
          <View className="borrow-item--content--row">
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
            onClick={onBorrowClick}
            text={`Borrow ${item.borrowApy}%`}
          />
          {/*{(*/}
          {/*  <>*/}
          {/*    <Divider marginT={10} />*/}
          {/*    <span className="insufficient">{t("insufficientBalance")}</span>*/}
          {/*  </>*/}
          {/*)}*/}
        </View>
      </div>
    </div>
  );
};