import React from "react"
import { observer } from "mobx-react"
import { Box, Button, SwipeableDrawer } from "@mui/material"
import "./styles.sass"
import { getProviderStore } from "App"
import { t } from "translations/translate"
import { Puller } from "components/puller/Puller"

export interface DisconnectDialogProps {
}

export const DisconnectDialog: React.FC<DisconnectDialogProps> = observer(
  () => {
    return (
      <SwipeableDrawer
        anchor={"bottom"}
        open={getProviderStore.disconnectDialog}
        onClose={() => (getProviderStore.disconnectDialog = false)}
        onOpen={getProviderStore.toggleDisconnectDialog}
        style={{ borderRadius: 16 }}
        disableSwipeToOpen={true}
      >
        <Puller/>
        <Box
          className={"drawer-container"}
          sx={{ width: "auto", minHeight: 300 }}
        >
          <h1 className={"tittle"}>{t("wallet.disconnectWalletDialog")}</h1>
          <div className={"description medium"}>{t("wallet.chooseDisconnection")}</div>
          <div className={"btn-container"}>
            <Button
              onClick={getProviderStore.disconnect}
              className={"btn"}
              variant={"contained"}
            >
              {t("wallet.disconnect")}
            </Button>
            <Button
              onClick={getProviderStore.toggleDisconnectDialog}
              className={"btn"}
              variant={"text"}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </Box>
      </SwipeableDrawer>
    )
  }
)
