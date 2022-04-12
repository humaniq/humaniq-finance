import React from "react";

export interface TextProps {
  text: string;
  size?: number;
  color?: string;
  style?: any;
  className?: string;
}

export const Text = ({
  text,
  size = 14,
  color = "#fff",
  style = {},
  className,
  ...rest
}: TextProps) => {
  return (
    <span
      style={{
        display: "flex",
        fontSize: size,
        color,
        ...style,
      }}
      className={className}
      {...rest}
    >
      {text}
    </span>
  );
};
