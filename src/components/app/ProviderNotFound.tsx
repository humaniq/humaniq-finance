import React from "react";
import { useTranslation } from "react-i18next";

export const ProviderNotFound = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span>{t<string>("notFound")}</span>
    </div>
  );
};
