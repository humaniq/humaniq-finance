import React from "react";
import { View, ViewDirections } from "../../ui/view/View";
import { Text } from "../../ui/text/Text";
import btcIcon from "../../../assets/images/ic_btc.svg";
import { Avatar } from "../../ui/avatar/Avatar";
import { Divider } from "../../ui/divider/Divider";
import { Button } from "../../ui/button/Button";
import "./TokenItem.style.sass";
import { t } from "translations/translate";

export interface TokenItemProps {
  title: string;
  subTitle: string;
  amount: string;
  subAmount: string;
  onClick?: () => void;
  onButtonClick?: () => void;
  className?: string;
  disabled?: boolean;
  showButton?: boolean;
  insufficientBalance?: boolean;
}

export const TokenItem: React.FC<TokenItemProps> = ({
  title,
  subTitle,
  amount,
  subAmount,
  onClick,
  onButtonClick,
  className,
  disabled,
  showButton = true,
  insufficientBalance = false,
  ...rest
}) => {
  return (
    <div onClick={onClick} className={`tkn-container ${className}`} {...rest}>
      <div className="tkn-container-content">
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
          {showButton && (
            <>
              <Divider marginT={10} />
              <Button
                disabled={disabled}
                className="token-button"
                onClick={onButtonClick}
                text="Deposit 4.06%"
              />
            </>
          )}
          {insufficientBalance && (
            <>
              <Divider marginT={10} />
              <span className="insufficient">{t("transaction.insufficientBalance")}</span>
            </>
          )}
        </View>
      </div>
    </div>
  );
};