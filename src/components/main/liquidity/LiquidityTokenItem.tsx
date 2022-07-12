import React from "react";
import { Avatar } from "../../ui/avatar/Avatar";
import "./LiquidityTokenItem.style.sass";
import {BorrowSupplyItem} from "models/types"
import {beautifyNumber} from "utils/utils"
import {icons} from "utils/icons"

export interface LiquidityTokenItemProps {
  item: BorrowSupplyItem
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export const LiquidityTokenItem: React.FC<LiquidityTokenItemProps> = ({
  item,
  onClick,
  className,
  disabled,
  ...rest
}) => {
  return (
    <div className={`liquidity-tkn-container`} {...rest}>
      <div className="liquidity-tkn-content">
        <Avatar className="avatar" size={30} icon={icons[item.symbol]} />
        <div className="row">
          <span className="title">{item.name}</span>
          <span className="title">{beautifyNumber(item.liquidity, true)}</span>
        </div>
      </div>
    </div>
  );
};
