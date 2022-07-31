import React from "react";
import { observer } from "mobx-react";
import "components/modals/ConnectWallet.style.sass";
import { t } from "translations/translate";
import ConnectIllustration from "../../assets/images/connect-illustration.svg";

export const ConnectWallet = observer(() => {
  return (
    <div className="connect-wallet">
     <img alt="connect-illustration" className="image" src={ConnectIllustration}/>
      <span className="title">{t("welcomeMessage")}</span>
      <span className="sub-title">{t("welcomeDescription")}</span>
      {/*<div className="buttons">*/}
      {/*  <Button className="later" text={t("common.mayBeLater")} />*/}
      {/*  <Button onClick={getProviderStore.toggleConnectDialog}*/}
      {/*          className="proceed" text={t("wallet.connectDescription")} />*/}
      {/*</div>*/}
    </div>
  );
});
