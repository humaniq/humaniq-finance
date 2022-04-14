import React, { FC } from "react";
import "./Button.style.sass";

export interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: any;
  className?: string;
}

/**
 * Button component
 *
 * @param text
 * @param onClick
 * @param className
 * @param style
 * @param disabled
 * @param props
 * @constructor
 */
export const Button: FC<ButtonProps> = ({
  text,
  onClick,
  className,
  style,
  disabled = false,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`btn-container ${className}`}
      style={style}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {text}
    </button>
  );
};
