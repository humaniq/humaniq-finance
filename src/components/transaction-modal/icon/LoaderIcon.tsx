import "./LoaderIcon.style.sass"
import React, {useMemo} from "react"
import {ReactComponent as Watch} from "assets/icons/ic_watch.svg"
import {ReactComponent as Done} from "assets/icons/ic_done.svg"
import {ReactComponent as Error} from "assets/icons/ic_error.svg"
import {TailSpin} from "react-loader-spinner"
import colors from "utils/colors"

interface LoaderIconProps {
  size?: number
  successIconSize?: number
  errorIconSize?: number
  loadingColor?: string
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  visible?: boolean
}

export const LoaderIcon = ({
                             size = 30,
                             loadingColor = colors.primary,
                             isLoading = false,
                             isSuccess = false,
                             isError = false,
                             successIconSize = 15,
                             visible = true,
                             errorIconSize = 20
                           }: LoaderIconProps) => {

  const getIcon = useMemo(() => {
    if (isSuccess) return (
      <div className="icon-container done">
        <Done width={successIconSize} height={successIconSize} className="icon"/>
      </div>
    )

    if (isError) return (
      <div className="icon-container error">
        <Error width={errorIconSize} height={errorIconSize} className="icon"/>
      </div>
    )

    if (isLoading) {
      return (
        <Watch width={size} height={size} className="icon"/>
      )
    }

    return null
  }, [isSuccess, isError, isLoading])

  if (!visible) return null

  return <div className="loader-icon" style={{
    width: size,
    height: size
  }}>
    {getIcon}
    {isLoading && (
      <TailSpin
        color={loadingColor}
        width={size}/>
    )}
  </div>
}
