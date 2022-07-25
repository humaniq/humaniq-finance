import React from "react";
import {TailSpin} from "react-loader-spinner"
import colors from "utils/colors"
import "./Button.style.sass";

export interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
  style?: any;
  className?: string;
  loading?: boolean
}

/**
 * Button component
 *
 * @param text
 * @param onClick
 * @param className
 * @param style
 * @param disabled
 * @param loading
 * @param props
 * @constructor
 */
export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className,
  style,
  disabled = false,
  loading = false,
  ...props
}) => {

  if (loading) return <div className="btn-loader">
    <TailSpin width={30} color={colors.primary} height={24}/>
  </div>

  return (
    <button
      disabled={disabled}
      className={`btn-container ${className}`}
      style={style}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {text}
    </button>
  );
};