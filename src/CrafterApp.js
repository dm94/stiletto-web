import React from "react";
import ItemSelector from "./components/ItemSelector";

function CrafterApp() {
  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <a className="navbar-brand" href="https://stiletto.comunidadgzone.es">
          Stiletto
        </a>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="https://stiletto.comunidadgzone.es">
              Crafter
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Clan
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a
                className="dropdown-item"
                href="https://stiletto.comunidadgzone.es/clan"
              >
                Manage
              </a>
              <a className="dropdown-item" href="#">
                Quality map
              </a>
              <a className="dropdown-item" href="#">
                Alliance management
              </a>
            </div>
          </li>
        </ul>
      </nav>
      <main className="container-fluid">
        <ItemSelector />
      </main>
    </div>
  );
}

export default CrafterApp;
