import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { getProviderStore } from "../../App";

export const WalletNotConnected = observer(() => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span>{t("walletNotConnected")}</span>
      <button
        onClick={getProviderStore.connect}
        style={{ marginTop: 30, width: "100%", height: 60 }}
      >
        {t("connectWallet")}
      </button>
    </div>
  );
});
