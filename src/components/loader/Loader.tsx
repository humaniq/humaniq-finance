import React from "react";
import {RotatingLines} from "react-loader-spinner"
import colors from "utils/colors";
import "./Loader.style.sass";
import {useDisableBodyScroll} from "hooks/useDisableBodyScroll"

interface LoaderProps {
  visible?: boolean;
  color?: string;
  message?: string;
}

export const Loader = ({ visible = false, color = colors.primary}: LoaderProps) => {
  useDisableBodyScroll(visible)

  if (!visible) return null

  return (
    <div className="loader-container">
      <RotatingLines
        width="50"
        strokeColor={color}
        strokeWidth="2" />
    </div>
  );
};
