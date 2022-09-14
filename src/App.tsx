import React, {useEffect} from "react"
import {HashRouter as Router, Route, Routes} from "react-router-dom"
import routes from "./utils/routes"
import {EVMProvider} from "stores/provider/providerStore"
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
import {TransactionModal} from "components/transaction-modal/TransactionModal"
import {transactionStore} from "stores/app/transactionStore"
import {ConnectionNotSupportedModal} from "components/connection-support/ConnectionNotSupportedModal"

window.Buffer = b.Buffer

export const getProviderStore = EVMProvider

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
    if (window.location.href.includes("#/details")) {
      window.location.replace(window.location.href.split("#")[0])
    } else {
      ;(async () => {
        await getProviderStore.init()
      })()
    }

    return () => getProviderStore.removeListeners()
  }, [])

  return (
    <>
      <SharedDataProvider>
        <div className="App">
          {getProviderStore.initialized ? (
            <Router>
              <Routes>
                <Route
                  path={routes.home.path}
                  element={<Home/>}
                />
                <Route
                  path={routes.transaction.path}
                  element={<Transaction/>}
                />
                <Route
                  path="*"
                  element={<Home/>}
                />
              </Routes>
            </Router>
          ) : null}
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
        <TransactionModal
          status={transactionStore.transactionMessageStatus}
          visible={transactionStore.transactionMessageVisible}
        />
      </SharedDataProvider>
      <ConnectDialog/>
      <DisconnectDialog/>
      <ConnectionNotSupportedModal
        isVisible={getProviderStore.notSupportedNetwork}
      />
    </>
  )
})

export default App
