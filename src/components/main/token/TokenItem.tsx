import React from "react";
import { View, ViewDirections } from "../../ui/view/View";
import { Text } from "../../ui/text/Text";
import btcIcon from "../../../assets/images/ic_btc.svg";
import { Avatar } from "../../ui/avatar/Avatar";
import { Divider } from "../../ui/divider/Divider";
import { Button } from "../../ui/button/Button";
import "./TokenItem.style.sass";

export interface TokenItemProps {
  title: string;
  subTitle: string;
  amount: string;
  subAmount: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const TokenItem: React.FC<TokenItemProps> = ({
  title,
  subTitle,
  amount,
  subAmount,
  onClick,
  className,
  disabled,
  ...rest
}) => {
  return (
    <div className={`tkn-container ${className}`} {...rest}>
      <View className="tkn-container-content">
        <Avatar className="avatar" size={30} icon={btcIcon} />
        <View className="right" direction={ViewDirections.COLUMN}>
          <View className="row">
            <Text className="title" text={title} />
            <Text className="title" text={amount} />
          </View>
          <View className="row-2">
            <Text className="title" text={subTitle} />
            <Text className="title" text={subAmount} />
          </View>
          <Divider marginT={10} />
          <Button
            disabled={disabled}
            className="token-button"
            onClick={onClick}
            text="Deposit 4.06%"
          />
        </View>
      </View>
    </div>
  );
};
