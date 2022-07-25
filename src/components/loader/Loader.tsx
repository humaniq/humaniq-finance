import React from "react";
import {RotatingLines} from "react-loader-spinner"
import colors from "utils/colors";
import { t } from "translations/translate";
import "./Loader.style.sass";

export const Loader = () => {
  return (
    <div className="loader-container">
      <RotatingLines
        width="100"
        strokeColor={colors.primary}
        strokeWidth="2" />
      <span className="loader-container__message">
        {t("common.loading")}...
      </span>
    </div>
  );
};
