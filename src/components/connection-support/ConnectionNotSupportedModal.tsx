import "components/connection-support/ConnectionNotSupportedModal.style.sass"
import ConnectIllustration from "assets/images/connect-illustration.svg"
import React from "react"
import {t} from "translations/translate"
import {observer} from "mobx-react"

interface ConnectionNotSupportedModal {
  isVisible?: boolean
}

export const ConnectionNotSupportedModal = observer(({
                                                       isVisible = false
                                                     }: ConnectionNotSupportedModal) => {
  if (!isVisible) return null

  return <div className="connection-not-supported">
    <div className="modal">
      <span className="title">{t("appName")}</span>
      <img alt="connect-illustration" className="image" src={ConnectIllustration}/>
      <span className="message">{t("connection.notSupported")}</span>
    </div>
  </div>
})
