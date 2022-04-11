import React, { ReactNode } from "react";

export interface MainInfoHeaderProps {
  backgroundColor?: string;
  style?: any;
  children: ReactNode;
}

export const MainInfoHeader = ({
  backgroundColor = "#001833",
  children,
  style = {},
}: MainInfoHeaderProps) => {
  return (
    <div
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
