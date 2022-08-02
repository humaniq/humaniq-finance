import React from "react"
import "./AddressView.style.sass"
import {observer} from "mobx-react"

export interface AddressViewProps {
  title?: string | null;
  onClick?: () => void;
  style?: any;
  className?: string;
}

export const AddressView: React.FC<AddressViewProps> = observer(({
                                                                   title,
                                                                   onClick,
                                                                   style = {},
                                                                   className
                                                                 }) => {
  return (
    <button onClick={onClick} className={`address-container ${className}`} style={style}>
      {title}
    </button>
  )
})
