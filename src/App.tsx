import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.sass";
import routes from "./utils/routes";
import { ETHProvider } from "./stores/provider/providerStore";

import b from "buffer";
import { Main } from "./screens/main/Main";
import { Calc } from "./screens/calc/Calc";

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
          {/*<Route path={routes.home.path} element={<Main/>}/>*/}
          <Route path={routes.home.path} element={<Calc />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
