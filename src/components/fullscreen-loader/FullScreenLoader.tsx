import "components/fullscreen-loader/FullScreenLoader.style.sass"
import {t} from "translations/translate"
import {CircularProgress} from "@mui/material"
import React from "react"

interface FullScreenLoaderProps {
  isVisible?: boolean
}

export const FullScreenLoader = ({isVisible = false}: FullScreenLoaderProps) => {
  if (!isVisible) return null

  return <div className="fullscreenLoader">
    <div className="content">
      <CircularProgress className={"progress"}/>
      <span className="title">{t("transaction.wait")}</span>
    </div>
  </div>
}
