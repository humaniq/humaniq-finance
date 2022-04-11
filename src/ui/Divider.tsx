import React from "react";
import colors from "../utils/colors";

export interface DividerProps {
  height?: number;
  color?: string;
  marginT?: number;
  marginB?: number;
}

export const Divider = ({
  height = 0.5,
  color = colors.grey,
  marginT = 0,
  marginB = 0,
}: DividerProps) => {
  return (
    <div
      style={{
        height,
        backgroundColor: color,
        marginTop: marginT,
        marginBottom: marginB,
      }}
    />
  );
};
