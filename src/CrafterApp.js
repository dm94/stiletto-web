import React from "react";
import ItemSelector from "./components/ItemSelector";
import DiscordConnection from "./components/DiscordConnection";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function CrafterApp() {
  /*return <ItemSelector />;*/
  return (
    <Router>
      <header className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar bg-dark">
        <Link className="navbar-brand" to="/">
          Stiletto
        </Link>
        <div className="navbar-nav-scroll">
          <ul className="navbar-nav bd-navbar-nav flex-row">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Crafting
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clan">
                Clan
              </Link>
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
                Other Links
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a
                  className="dropdown-item"
                  href="https://github.com/dm94/stiletto-web/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report Bugs
                </a>
                <a
                  className="dropdown-item"
                  href="https://top.gg/bot/715948052979908911"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord Bot
                </a>
                <a
                  className="dropdown-item"
                  href="https://discord.gg/PdXxUWd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dm94´s Discord
                </a>
              </div>
            </li>
          </ul>
        </div>
      </header>
      <main role="main" className="container-fluid h-100">
        <Switch>
          <Route path="/clan" component={DiscordConnection} />
          <Route path="/" component={ItemSelector} />
          <Route path="/members" component={ItemSelector} />
          <Route path="/walkerlist" component={ItemSelector} />
        </Switch>
      </main>
      <footer className="footer mt-auto py-3 container-fluid bg-dark text-white">
        <div className="container">
          Copyright © 2020 Stiletto.
          <a
            href="https://github.com/dm94/stiletto-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github project
          </a>{" "}
          | This website are utilities related to the game Last Oasis by{" "}
          <a
            href="https://www.donkey.team/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donkey Crew
          </a>
        </div>
      </footer>
    </Router>
  );
}

export default CrafterApp;
