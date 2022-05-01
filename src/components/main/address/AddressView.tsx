import React from "react";
import "./AddressView.style.sass";
import { t } from "translations/translate";

export interface AddressViewProps {
  title?: string | null;
  onClick?: () => void;
  style?: any;
  className?: string;
}

export const AddressView: React.FC<AddressViewProps> = ({
  title,
  onClick,
  style = {},
  className,
}) => {
  return (
    <div className="dropdown">
      <button className={`address-container ${className}`} style={style}>
        {title}
      </button>
      <div onClick={onClick} className="dropdown-content">
        <span>{t("wallet.disconnect")}</span>
      </div>
    </div>
  );
};
