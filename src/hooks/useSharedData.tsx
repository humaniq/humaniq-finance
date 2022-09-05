import {createContext, useContext, useState} from "react"

const SharedDataContext = createContext({
  data: null,
  setData: (_: any) => {}
})

const SharedDataProvider = ({children}: {children: any}) => {
  const [data, setData] = useState(null)

  return <SharedDataContext.Provider value={{data, setData}}>
    {children}
  </SharedDataContext.Provider>
}

export const useSharedData = () => useContext(SharedDataContext)

export {SharedDataContext, SharedDataProvider}
