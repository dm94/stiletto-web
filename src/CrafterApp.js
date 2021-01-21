import React, { useState } from "react";
import CookieConsent from "react-cookie-consent";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Analytics from "react-router-ga";
import i18next from "i18next";
import ItemSelector from "./pages/ItemSelector";
import DiscordConnection from "./pages/DiscordConnection";
import ClanList from "./pages/ClanList";
import MemberList from "./pages/MemberList";
import WalkerList from "./pages/WalkerList";
import ClanMaps from "./pages/ClanMaps";
import Home from "./pages/Home";
import TradeSystem from "./pages/TradeSystem";
import Diplomacy from "./pages/Diplomacy";
import AuctionTimers from "./pages/AuctionTimers";
import Others from "./pages/Others";
import Map from "./pages/Map";
import Transactions from "./pages/Transactions";
import { getStyle } from "./components/BGDarkSyles";

function CrafterApp() {
  const [t] = useTranslation();
  const [showChangeLanguageModal, setChangeLanguageModal] = useState(false);
  let showHideClassName = showChangeLanguageModal
    ? "modal d-block"
    : "modal d-none";
  return (
    <Router>
      <header>
        <div className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Stiletto
            </Link>
            <div className="navbar-collapse collapse show" id="menucollapse">
              <ul className="navbar-nav mr-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/crafter">
                    {t("Crafting")}
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
                    {t("Profile")}
                  </Link>
                  <div
                    className={getStyle("dropdown-menu")}
                    aria-labelledby="clanDrodown"
                  >
                    <Link className={getStyle("dropdown-item")} to="/profile">
                      {t("Profile")}
                    </Link>
                    <Link className={getStyle("dropdown-item")} to="/clanlist">
                      {t("Clan List")}
                    </Link>
                    <Link className={getStyle("dropdown-item")} to="/maps">
                      {t("Resources maps")}
                    </Link>
                    <Link
                      className={getStyle("dropdown-item")}
                      to="/transactions"
                    >
                      {t("Transactions")}
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trades">
                    {t("Trades")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auctions">
                    {t("Auctions timers")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/others">
                    {t("Other info")}
                  </Link>
                </li>
              </ul>
              <button
                className="btn btn-sm"
                onClick={() => {
                  setChangeLanguageModal(true);
                }}
              >
                <img
                  className="rounded"
                  width="30%"
                  src={
                    localStorage.getItem("i18nextLng").includes("es")
                      ? "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/es.jpg"
                      : localStorage.getItem("i18nextLng").includes("ru")
                      ? "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/ru.jpg"
                      : localStorage.getItem("i18nextLng").includes("fr")
                      ? "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/fr.jpg"
                      : "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/en.jpg"
                  }
                  alt="Change language"
                />
              </button>
              {discordButton(t)}
            </div>
          </div>
        </div>
      </header>
      <main role="main" className={getStyle("container-fluid pt-4")}>
        <Analytics id={process.env.REACT_APP_GA_ID}>
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
            <Route path="/others" component={Others} />
            <Route exact path="/transactions" component={Transactions} />
            <Route path="/map" component={Map} />
          </Switch>
        </Analytics>
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className={getStyle("modal-content")}>
              <div className="modal-header">{t("Change language")}</div>
              <div className="modal-body">
                <div className="row text-center">
                  <div className="col">
                    <img
                      className="img-thumbnail"
                      src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/es.jpg"
                      alt="Spanish language"
                      onClick={() => switchLanguage("es")}
                    />
                    <p>{t("Spanish")}</p>
                  </div>
                  <div className="col">
                    <img
                      className="img-thumbnail"
                      src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/en.jpg"
                      alt="English language"
                      onClick={() => switchLanguage("en")}
                    />
                    <p>{t("English")}</p>
                  </div>
                  <div className="col">
                    <img
                      className="img-thumbnail"
                      src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/ru.jpg"
                      alt="Russian language"
                      onClick={() => switchLanguage("ru")}
                    />
                    <p>{t("Russian")}</p>
                  </div>
                  <div className="col">
                    <img
                      className="img-thumbnail"
                      src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/fr.jpg"
                      alt="French language"
                      onClick={() => switchLanguage("fr")}
                    />
                    <p>{t("French")}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className={
                    localStorage.getItem("darkmode") !== "true"
                      ? "btn btn-outline-secondary"
                      : "btn btn-outline-light"
                  }
                  onClick={() => {
                    setChangeLanguageModal(false);
                  }}
                >
                  {t("Accept")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer mt-3 py-3 container-fluid bg-dark text-white h-100">
        <div className="row">
          <div className="col-10">
            Copyright © 2020 Stiletto{" | "}
            <a
              href="https://github.com/dm94/stiletto-web"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="GitHub last commit"
                src="https://img.shields.io/github/last-commit/dm94/stiletto-web"
              ></img>
            </a>
            {" | "}
            {t(
              "This website are utilities related to the game Last Oasis but is not affiliated with"
            )}{" "}
            <a
              href="https://www.donkey.team/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donkey Crew
            </a>
          </div>
          <div className="col-2">{darkMode()}</div>
        </div>
      </footer>
      <CookieConsent
        location="bottom"
        buttonText="OK"
        cookieName="acceptscookies"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
      >
        {t("This website uses cookies to enhance the user experience.")}
      </CookieConsent>
    </Router>
  );
}

function switchLanguage(lng) {
  i18next.changeLanguage(lng);
}

function darkMode() {
  if (localStorage.getItem("darkmode") !== "true") {
    return (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          localStorage.setItem("darkmode", true);
          window.location.reload();
        }}
      >
        Dark Theme Mode
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          localStorage.setItem("darkmode", false);
          window.location.reload();
        }}
      >
        Ligh Theme Mode
      </button>
    );
  }
}

function discordButton(t) {
  if (
    localStorage.getItem("discordid") != null &&
    localStorage.getItem("token") != null
  ) {
    return (
      <Link className="btn btn-outline-light" to="/profile">
        {t("Profile")}
      </Link>
    );
  } else {
    let urlLink =
      "https://discord.com/api/oauth2/authorize?client_id=" +
      process.env.REACT_APP_DISCORD_CLIENT_ID +
      "&redirect_uri=" +
      process.env.REACT_APP_API_URL +
      "/discordlogin.php&scope=identify%20guilds&response_type=code";
    return (
      <a className="btn btn-outline-light" href={urlLink}>
        <i className="fab fa-discord"></i> {t("Login with discord")}
      </a>
    );
  }
}

export default CrafterApp;
