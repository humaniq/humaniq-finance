import React from "react";
import {RotatingLines} from "react-loader-spinner"
import colors from "utils/colors";
import { t } from "translations/translate";
import "./Loader.style.sass";

interface LoaderProps {
  color?: string;
}

export const Loader = ({ color = colors.primary }: LoaderProps) => {
  return (
    <div className="loader-container">
      <RotatingLines
        width="100"
        strokeColor={color}
        strokeWidth="2" />
      <span className="message">
        {t("common.loading")}...
      </span>
    </div>
  );
};
