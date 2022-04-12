import React, { ReactNode } from "react";

export enum ViewDirections {
  ROW = "row",
  COLUMN = "column",
}

export interface ViewProps {
  direction?: ViewDirections;
  style?: any;
  className?: string;
  children?: ReactNode;
}

export const View = ({
  direction = ViewDirections.ROW,
  children,
  style,
  className,
  ...rest
}: ViewProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        ...style,
      }}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
};
