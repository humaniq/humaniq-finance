import React from "react";
import { TailSpin } from "react-loader-spinner";
import "./Loader.style.sass";
import colors from "utils/colors";
import { t } from "translations/translate";

export const Loader = () => {
  return (
    <div className="loader-container">
      <TailSpin
        height="100"
        width="100"
        color={colors.primary}
        ariaLabel="loading"
      />
      <span className="loader-container__message">
        {t("general.loading")}...
      </span>
    </div>
  );
};
