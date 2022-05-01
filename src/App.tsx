import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.sass";
import routes from "./utils/routes";
import { ETHProvider } from "stores/provider/providerStore";

import b from "buffer";
import { Home } from "screens/main/Home";
import { Valuation } from "screens/valuation/Valuation";
import { ConnectWallet } from "components/modals/ConnectWallet";
import { observer } from "mobx-react";

window.Buffer = b.Buffer;

export const getProviderStore = ETHProvider;

export const App = observer(() => {
  useEffect(() => {
    (async () => {
      await getProviderStore.start();
    })();
  }, []);

  return (
    <div className="App">
      {getProviderStore.initialized ? (
        <>
          {getProviderStore.currentAccount ? (
            <Router>
              <Routes>
                <Route path={routes.home.path} element={<Home />} />
                <Route path={routes.valuation.path} element={<Valuation />} />
              </Routes>
            </Router>
          ) : (
            <ConnectWallet />
          )}
        </>
      ) : null}
    </div>
  );
});

export default App;
