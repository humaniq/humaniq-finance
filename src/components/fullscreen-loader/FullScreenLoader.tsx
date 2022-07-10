import {t} from "translations/translate"
import "./style.sass"

interface FullScreenLoaderProps {
  isVisible?: boolean
}

export const FullScreenLoader = ({isVisible = false}: FullScreenLoaderProps) => {
  if (!isVisible) return null

  return <div className="fullscreenLoader">
    <div className="content">
      <span className="title">Please wait for the transaction...</span>
    </div>
  </div>
}
