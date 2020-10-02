import React from "react";
import ItemSelector from "./components/ItemSelector";

function App() {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <p className="navbar-brand">Stiletto</p>
      </nav>
      <main className="container-fluid">
        <ItemSelector />
      </main>
    </React.Fragment>
  );
}

export default App;
