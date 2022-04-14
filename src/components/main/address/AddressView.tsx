import React, { FC } from "react";
import "./AddressView.style.sass";

export interface AddressViewProps {
  title: string;
  onClick?: () => void;
  style?: any;
  className?: string;
}

export const AddressView: FC<AddressViewProps> = ({
  title,
  onClick,
  style = {},
  className,
}) => {
  return (
    <button
      className={`address-container ${className}`}
      style={style}
      onClick={onClick}
    >
      {title}
    </button>
  );
};
