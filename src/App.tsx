import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.sass";
import routes from "./utils/routes";
import { ETHProvider } from "stores/provider/providerStore";
import b from "buffer";
import { Home } from "screens/main/Home";
import { Transaction } from "screens/transaction/Transaction";
import { ConnectWallet } from "components/modals/ConnectWallet";
import { observer } from "mobx-react";
import {SharedDataProvider} from "hooks/useSharedData"

window.Buffer = b.Buffer;

export const getProviderStore = ETHProvider;

export const App = observer(() => {
  useEffect(() => {
    (async () => {
      await getProviderStore.init();
    })();

    return () => getProviderStore.removeListeners();
  }, []);

  return (
    <SharedDataProvider>
      <div className="App">
        {getProviderStore.initialized ? (
          <>
            {getProviderStore.hasProvider ? (
              <>
                {getProviderStore.currentAccount ? (
                  <Router>
                    <Routes>
                      <Route path={routes.home.path} element={<Home />} />
                      <Route
                        path={routes.transaction.path}
                        element={<Transaction />}
                      />
                    </Routes>
                  </Router>
                ) : (
                  <ConnectWallet />
                )}
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </SharedDataProvider>
  );
});

export default App;