import {useEffect} from 'react'

export const useDisableBodyScroll = (visible: boolean) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [visible])
}
