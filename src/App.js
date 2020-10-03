import React from "react";
import ItemSelector from "./components/ItemSelector";

function App() {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <a className="navbar-brand" href="https://stiletto.comunidadgzone.es/">
          Stiletto
        </a>
      </nav>
      <main className="container-fluid">
        <ItemSelector />
      </main>
    </React.Fragment>
  );
}

export default App;
