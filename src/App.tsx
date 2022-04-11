import React, { useEffect } from "react";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import routes from "./utils/routes";
import NotFound from "./screens/404/404";
import { Home } from "./screens/home/home";
import { ETHProvider } from "./stores/provider/providerStore";

import b from "buffer";
import { WalletNotConnected } from "./components/app/WalletNotConnected";
import { ProviderNotFound } from "./components/app/ProviderNotFound";

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
      <Header />
      {getProviderStore.initialized ? (
        <>
          {getProviderStore.hasProvider ? (
            <>
              {getProviderStore.currentAccount ? (
                <Router>
                  <Routes>
                    <Route path={routes.home.path} element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
              ) : (
                <WalletNotConnected />
              )}
            </>
          ) : (
            <ProviderNotFound />
          )}
        </>
      ) : null}
      <Footer />
    </div>
  );
}

export default App;
