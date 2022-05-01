import React from "react";
import { observer } from "mobx-react";
import "components/modals/ConnectWallet.style.sass";
import { getProviderStore } from "App";

export const ConnectWallet: React.FC = observer(({}) => {
  return (
    <div className="connect-wallet">
      <span className="connect-wallet__logo">SAVY</span>

      <div className="wallet-item" onClick={getProviderStore.onConnect}>
        <span className="wallet-item__name">Connect</span>
        <span className="wallet-item__description">
          Connect your wallet to proceed
        </span>
      </div>
    </div>
  );
});
