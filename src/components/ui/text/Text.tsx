import React, { FC } from "react";
import "./Text.style.sass";

export interface TextProps {
  text: string;
  size?: number;
  color?: string;
  style?: any;
  className?: string;
}

/**
 * Text component
 *
 * @param text
 * @param size
 * @param color
 * @param style
 * @param className
 * @param rest
 * @constructor
 */
export const Text: FC<TextProps> = ({
  text,
  size = 14,
  color = "#fff",
  style = {},
  className,
  ...rest
}) => {
  return (
    <span
      style={{
        fontSize: size,
        color,
        ...style,
      }}
      className={`txt-container ${className}`}
      {...rest}
    >
      {text}
    </span>
  );
};
