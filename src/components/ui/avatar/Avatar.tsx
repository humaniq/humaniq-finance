import React, { ReactNode } from "react";
import "./Avatar.style.sass";

export interface AvatarProps {
  size: number;
  icon: string;
  children?: ReactNode;
  style?: any;
  className?: string;
}

/**
 * Avatar component
 *
 * @param icon
 * @param size
 * @param style
 * @param className
 * @constructor
 */
export const Avatar: React.FC<AvatarProps> = ({
  icon,
  size,
  style,
  className,
}) => {
  return (
    <div
      className={`avatar-container br-50 ${className}`}
      style={{
        ...style,
      }}
    >
      <img alt="" src={icon} style={{ width: size, height: size }} />
    </div>
  );
};
