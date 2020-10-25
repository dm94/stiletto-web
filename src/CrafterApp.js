import React from "react";
import ItemSelector from "./pages/ItemSelector";
import DiscordConnection from "./pages/DiscordConnection";
import ClanList from "./pages/ClanList";
import MemberList from "./pages/MemberList";
import WalkerList from "./pages/WalkerList";
import ClanMaps from "./pages/ClanMaps";
import CookieConsent from "react-cookie-consent";
import Home from "./pages/Home";
import TradeSystem from "./pages/TradeSystem";
import Diplomacy from "./pages/Diplomacy";
import AuctionTimers from "./pages/AuctionTimers";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function CrafterApp() {
  return (
    <Router>
      <header className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar bg-dark">
        <Link className="navbar-brand" to="/">
          Stiletto
        </Link>
        <div className="navbar-nav-scroll">
          <ul className="navbar-nav bd-navbar-nav flex-row">
            <li className="nav-item">
              <Link className="nav-link" to="/crafter">
                Crafting
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/profile"
                id="clanDrodown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Clan
              </Link>
              <div className="dropdown-menu" aria-labelledby="clanDrodown">
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
                <Link className="dropdown-item" to="/clanlist">
                  Clan List
                </Link>
                <Link className="dropdown-item" to="/members">
                  Members
                </Link>
                <Link className="dropdown-item" to="/walkerlist">
                  Walker List
                </Link>
                <Link className="dropdown-item" to="/maps">
                  Resources maps
                </Link>
                <Link className="dropdown-item" to="/diplomacy">
                  Diplomacy
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/trades">
                Trades
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/auctions">
                Auction Timers
              </Link>
            </li>
            <li className="nav-item dropdown">
              <div
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Other Links
              </div>
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
      <main role="main" className="container-fluid pt-4">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/profile" component={DiscordConnection} />
          <Route path="/crafter" component={ItemSelector} />
          <Route path="/members" component={MemberList} />
          <Route path="/clanlist" component={ClanList} />
          <Route path="/walkerlist" component={WalkerList} />
          <Route path="/maps" component={ClanMaps} />
          <Route path="/trades" component={TradeSystem} />
          <Route path="/diplomacy" component={Diplomacy} />
          <Route path="/auctions" component={AuctionTimers} />
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
          | This website are utilities related to the game Last Oasis but is not
          affiliated with{" "}
          <a
            href="https://www.donkey.team/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donkey Crew
          </a>
        </div>
      </footer>
      <CookieConsent
        location="bottom"
        buttonText="Let´s GO!!"
        cookieName="acceptscookies"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </Router>
  );
}

export default CrafterApp;
