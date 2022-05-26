import React, { ReactNode } from "react";
import "./View.style.sass";

export enum ViewDirections {
  ROW = "view-row",
  COLUMN = "view-column",
}

export interface ViewProps {
  direction?: ViewDirections;
  style?: any;
  className?: string;
  children?: ReactNode;
}

/**
 * View container component
 *
 * @param direction
 * @param children
 * @param style
 * @param className
 * @param rest
 * @constructor
 */
export const View: React.FC<ViewProps> = ({
  direction = ViewDirections.ROW,
  children,
  style,
  className,
  ...rest
}) => {
  return (
    <div style={style} className={`${direction} ${className}`} {...rest}>
      {children}
    </div>
  );
};