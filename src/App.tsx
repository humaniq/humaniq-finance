import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import routes from "./utils/routes";
import { ETHProvider } from "./stores/provider/providerStore";

import b from "buffer";
import { WalletNotConnected } from "./components/app/WalletNotConnected";
import { ProviderNotFound } from "./components/app/ProviderNotFound";
import { Main } from "./screens/main/Main";

window.Buffer = b.Buffer;

export const getProviderStore = ETHProvider;

function App() {
  useEffect(() => {
    (async () => {
      await getProviderStore.init();
    })();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path={routes.home.path} element={<Main />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
