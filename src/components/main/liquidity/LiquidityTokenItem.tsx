import React from "react";
import { Text } from "../../ui/text/Text";
import BTCIcon from "../../../assets/images/ic_btc.svg";
import { Avatar } from "../../ui/avatar/Avatar";
import "./LiquidityTokenItem.style.sass";

export interface LiquidityTokenItemProps {
  title: string;
  subTitle: string;
  amount: string;
  subAmount: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const LiquidityTokenItem: React.FC<LiquidityTokenItemProps> = ({
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
    <div className={`liquidity-tkn-container`} {...rest}>
      <div className="liquidity-tkn-content">
        <Avatar className="avatar" size={30} icon={BTCIcon} />
        <div className="row">
          <Text className="title" text={title} />
          <Text className="title" text={amount} />
        </div>
      </div>
    </div>
  );
};
