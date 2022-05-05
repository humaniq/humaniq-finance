import React from "react";
import {Watch} from "react-loader-spinner"
import colors from "utils/colors";
import { t } from "translations/translate";
import "./Loader.style.sass";

export const Loader = () => {
  return (
    <div className="loader-container">
      <Watch
        height="90"
        width="90"
        color={colors.primary}
        ariaLabel="loading"
      />
      <span className="loader-container__message">
        {t("general.loading")}...
      </span>
    </div>
  );
};