import React from "react"
import "./Logo.style.sass"
import { ReactComponent as MainLogo } from "assets/icons/main_logo_light.svg"

interface LogoProps {
  children?: React.ReactNode
}

export const Logo = ({ children }: LogoProps) => {
  return <div className={"app-logo"}>
    <MainLogo width={80} height={34} className={"logo-img"}/>
    {children}
  </div>
}
