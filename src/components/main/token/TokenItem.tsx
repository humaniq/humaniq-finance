import React, { FC } from "react";
import { View, ViewDirections } from "../../ui/view/View";
import { Text } from "../../ui/text/Text";
import colors from "../../../utils/colors";
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
}

export const TokenItem: FC<TokenItemProps> = ({
  title,
  subTitle,
  amount,
  subAmount,
  onClick,
  className,
  ...rest
}) => {
  return (
    <div className={`tkn-container ${className}`} {...rest}>
      <View className="content">
        <Avatar className="avatar" size={30} icon={btcIcon} />

        <View className="right" direction={ViewDirections.COLUMN}>
          <View className="row">
            <Text color={colors.blackText} text={title} />
            <Text size={17} color={colors.blackText} text={amount} />
          </View>

          <View className="row-2">
            <Text color={colors.textGrey} text={subTitle} />
            <Text size={15} color={colors.textGrey} text={subAmount} />
          </View>

          <Divider marginT={10} />

          <Button className="button" onClick={onClick} text="Deposit 4.06%" />
        </View>
      </View>
    </div>
  );
};
