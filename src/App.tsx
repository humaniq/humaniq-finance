import React, {useEffect} from "react"
import {HashRouter as Router, Route, Routes} from "react-router-dom"
import routes from "./utils/routes"
import {ETHProvider} from "stores/provider/providerStore"
import b from "buffer"
import {Home} from "screens/main/Home"
import {Transaction} from "screens/transaction/Transaction"
import {observer} from "mobx-react"
import {SharedDataProvider} from "hooks/useSharedData"
import {AlertProps, Snackbar} from "@mui/material"
import {app} from "stores/app/appStore"
import "./App.style.sass"
import MuiAlert from "@mui/material/Alert"
import {ConnectDialog} from "components/dialogs/ConnectDialog"
import {DisconnectDialog} from "components/dialogs/DisconnectDialog"
import {ConnectWallet} from "components/modals/ConnectWallet"

window.Buffer = b.Buffer

export const getProviderStore = ETHProvider

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return (
    <MuiAlert
      sx={{borderColor: "white"}}
      elevation={6}
      ref={ref}
      variant="outlined"
      {...props}
    />
  )
})

export const App = observer(() => {
  useEffect(() => {
    (async () => {
      await getProviderStore.init()
    })()

    return () => getProviderStore.removeListeners()
  }, [])

  return (
    <>
      <SharedDataProvider>
        <div className="App">
          {getProviderStore.currentAccount ? (
            <Router>
              <Routes>
                <Route path={routes.home.path} element={<Home/>}/>
                <Route
                  path={routes.transaction.path}
                  element={<Transaction/>}
                />
              </Routes>
            </Router>
          ) : <ConnectWallet/>}
          <Snackbar
            open={app.alert.displayAlert}
            autoHideDuration={6000}
            onClose={app.alert.alertClose}
            style={{backgroundColor: "white"}}
          >
            <Alert
              onClose={app.alert.alertClose}
              severity="success"
              sx={{width: "100%"}}
            >
              {app.alert.alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </SharedDataProvider>
      <ConnectDialog />
      <DisconnectDialog />
    </>
  )
})

export default App