import "./ConnectionNotSupportedModal.style.sass"
import React from "react"
import {t} from "translations/translate"
import {observer} from "mobx-react"
import {Button} from "components/ui/button/Button"
import {noop} from "utils/common"

interface ConnectionNotSupportedModal {
  isVisible?: boolean
  handleClearClick?: typeof noop
}

export const ConnectionNotSupportedModal = observer(({
                                                       isVisible = false,
                                                       handleClearClick
                                                     }: ConnectionNotSupportedModal) => {
  if (!isVisible) return null

  return <div className="connection-not-supported">
    <div className="modal">
      <span className="title">{t("connection.networkChange")}</span>
      <span className="message">{t("connection.notSupported")}</span>
      <Button onClick={handleClearClick} className="clear" text={t("common.clear")}/>
    </div>
  </div>
})
