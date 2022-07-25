import React from "react";
import colors from "../../../utils/colors";

export interface DividerProps {
  height?: number;
  color?: string;
  marginT?: number;
  marginB?: number;
  className?: string;
}

/**
 * Divider component
 *
 * @param height
 * @param color
 * @param marginT
 * @param marginB
 * @param className
 * @constructor
 */
export const Divider: React.FC<DividerProps> = ({
  height = 0.5,
  color = colors.grey,
  marginT = 0,
  marginB = 0,
  className,
}) => {
  return (
    <div
      className={`${className}`}
      style={{
        height,
        backgroundColor: color,
        marginTop: marginT,
        marginBottom: marginB,
      }}
    />
  );
};
