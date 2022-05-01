import React from "react";
import "./AddressView.style.sass";

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
    <button
      className={`address-container ${className}`}
      style={style}
      onClick={onClick}
    >
      {title}
    </button>
  );
};
