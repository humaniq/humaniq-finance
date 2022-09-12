import "./ConnectionNotSupportedModal.style.sass"
import React from "react"
import {t} from "translations/translate"
import {observer} from "mobx-react"
import {noop} from "utils/common"

interface Props {
  isVisible?: boolean
  handleClearClick?: typeof noop
}

export const ConnectionNotSupportedModal = observer(({
                                                       isVisible = false,
                                                     }: Props) => {
  if (!isVisible) return null

  return <div className="connection-not-supported">
    <div className="modal">
      <span className="title">{t("connection.networkChange")}</span>
      <span className="message">{t("connection.notSupported")}</span>
    </div>
  </div>
})
