import React, { ReactNode } from "react";
import "./MainInfoHeader.style.sass";

export interface MainInfoHeaderProps {
  backgroundColor?: string;
  style?: any;
  className?: string;
  children: ReactNode;
}

/**
 * Main info header component
 *
 * @param children
 * @param style
 * @param className
 * @constructor
 */
export const MainInfoHeader: React.FC<MainInfoHeaderProps> = ({
  children,
  style = {},
  className,
}) => {
  return (
    <div style={style} className={`main-info-container ${className}`}>
      {children}
    </div>
  );
};
