import "components/fullscreen-loader/FullScreenLoader.style.sass"
import {t} from "translations/translate"
import {CircularProgress} from "@mui/material"
import React from "react"

interface FullScreenLoaderProps {
  isVisible?: boolean
  message?: string
}

export const FullScreenLoader = ({isVisible = false, message = t("transaction.wait")}: FullScreenLoaderProps) => {
  if (!isVisible) return null

  return <div className="fullscreenLoader">
    <div className="content">
      <CircularProgress className={"progress"}/>
      <span className="title">{message}</span>
    </div>
  </div>
}
