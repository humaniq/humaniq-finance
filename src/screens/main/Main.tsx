import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

export const Main = observer(() => {
  const { t } = useTranslation();

  return <div className="main" />;
});
