import React from "react";
import { useTranslation } from "react-i18next";
import colors from "../../utils/colors";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        height: 60,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span>{t<string>("appName")}</span>
    </div>
  );
};
