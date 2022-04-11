import React from "react";

export interface TextProps {
  text: string;
  size?: number;
  color?: string;
}

export const Text = ({ text, size = 14, color = "#fff" }: TextProps) => {
  return <span style={{ fontSize: size, color }}>{text}</span>;
};
