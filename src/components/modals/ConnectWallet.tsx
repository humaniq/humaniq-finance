import React from "react";
import { observer } from "mobx-react";
import { getProviderStore } from "App";
import "components/modals/ConnectWallet.style.sass";
import { t } from "translations/translate";

export const ConnectWallet = observer(() => {
  return (
    <div className="connect-wallet">
      <span className="connect-wallet__logo">{t("appName")}</span>
      <div className="wallet-item" onClick={getProviderStore.toggleConnectDialog}>
        <span className="wallet-item__name">{t("wallet.connect")}</span>
        <span className="wallet-item__description">
          {t("wallet.connectDescription")}
        </span>
      </div>
    </div>
  );
});