import React from "react";
import colors from "../../utils/colors";

export interface ButtonProps {
  text: string;
  color?: string;
  textColor?: string;
  textSize?: number;
  onClick?: () => void;
  style?: any;
  className?: string;
}

export const Button = ({
  text,
  onClick,
  color = colors.transparent,
  textColor = colors.blackText,
  textSize = 14,
  className,
  style,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={className}
      style={{
        border: "none",
        backgroundColor: color,
        color: textColor,
        fontSize: textSize,
        ...style,
      }}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  );
};
