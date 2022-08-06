import React from "react";
import { ReactComponent as CloseIcon } from "assets/icons/ic_close.svg";
import "./Header.style.sass";

export interface HeaderProps {
  title: string;
  onClose?: () => void;
}

export const Header = ({ title, onClose }: HeaderProps) => {
  return (
    <div className="header-container">
      <CloseIcon width={15} height={15} onClick={onClose} />
      <span className="title">{title}</span>
    </div>
  );
};
