import React from "react";
import {RotatingLines} from "react-loader-spinner"
import colors from "utils/colors";
import { t } from "translations/translate";
import "./Loader.style.sass";

interface LoaderProps {
  visible?: boolean;
  color?: string;
  message?: string;
}

export const Loader = ({ visible = false, color = colors.primary, message = t("common.loading") }: LoaderProps) => {
  if (!visible) return null

  return (
    <div className="loader-container">
      <RotatingLines
        width="100"
        strokeColor={color}
        strokeWidth="2" />
      <span className="message">
        {message}
      </span>
    </div>
  );
};
