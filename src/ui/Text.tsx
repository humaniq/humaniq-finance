import React from "react";

export interface TextProps {
  text: string;
  size: number;
  color: string;
}

export const Text = ({ text, size, color }: TextProps) => {
  return <span style={{ fontSize: size, color }}>{text}</span>;
};
