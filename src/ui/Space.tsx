import React, { ReactNode } from "react";

export enum SpaceDirections {
  ROW = "row",
  COLUMN = "column",
}

export interface SpaceProps {
  direction?: SpaceDirections;
  style?: any;
  children: ReactNode;
}

export const Space = ({
  direction = SpaceDirections.COLUMN,
  children,
  style,
}: SpaceProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: "flex-start",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
