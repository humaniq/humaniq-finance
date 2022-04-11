import React, { ReactNode } from "react";

export interface MainInfoHeaderProps {
  backgroundColor?: string;
  children: ReactNode;
}

export const MainInfoHeader = ({
  backgroundColor = "#001833",
  children,
}: MainInfoHeaderProps) => {
  return <div style={{ backgroundColor, width: "100%" }}>{children}</div>;
};
