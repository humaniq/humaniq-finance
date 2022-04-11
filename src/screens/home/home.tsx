import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

export const Home = observer(() => {
  const { t } = useTranslation();

  return <div className="home-card" />;
});
