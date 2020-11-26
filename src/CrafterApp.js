import React, { useState } from "react";
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
import Others from "./pages/Others";
import Map from "./pages/Map";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Analytics from "react-router-ga";
import i18next from "i18next";

function CrafterApp() {
  const [t] = useTranslation();
  const [showChangeLanguageModal, setChangeLanguageModal] = useState(false);
  let showHideClassName = showChangeLanguageModal
    ? "modal d-block"
    : "modal d-none";
  return (
    <Router>
      <header className="navbar navbar-expand navbar-dark flex-column flex-md-row bd-navbar bg-dark">
        <Link className="navbar-brand" to="/">
          Stiletto
        </Link>
        <div className="collapse navbar-collapse navbar-nav-scroll">
          <ul className="navbar-nav mr-auto">
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
              <div className="dropdown-menu" aria-labelledby="clanDrodown">
                <Link className="dropdown-item" to="/profile">
                  {t("Profile")}
                </Link>
                <Link className="dropdown-item" to="/clanlist">
                  {t("Clan List")}
                </Link>
                <Link className="dropdown-item" to="/maps">
                  {t("Resources maps")}
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
            className="btn d-none d-sm-block btn-sm"
            onClick={() => {
              setChangeLanguageModal(true);
            }}
          >
            <img
              className={
                localStorage.getItem("i18nextLng") === "es"
                  ? "rounded"
                  : "rounded d-none"
              }
              width="30%"
              src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/es.jpg"
              alt="Spanish language"
            />
            <img
              className={
                localStorage.getItem("i18nextLng") === "ru"
                  ? "rounded"
                  : "rounded d-none"
              }
              width="30%"
              src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/ru.jpg"
              alt="Russian language"
            />
            <img
              className={
                localStorage.getItem("i18nextLng") === "en"
                  ? "rounded"
                  : "rounded d-none"
              }
              width="30%"
              src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/en.jpg"
              alt="English language"
            />
            <img
              className={
                localStorage.getItem("i18nextLng") === "fr"
                  ? "rounded"
                  : "rounded d-none"
              }
              width="30%"
              src="https://raw.githubusercontent.com/dm94/stiletto-web/master/public/img/fr.jpg"
              alt="French language"
            />
          </button>
          {discordButton(t)}
        </div>
      </header>
      <main role="main" className="container-fluid pt-4">
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
            <Route path="/map" component={Map} />
          </Switch>
        </Analytics>
        <div className={showHideClassName}>
          <div className="modal-dialog">
            <div className="modal-content">
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
                  className="btn btn-outline-secondary"
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
      <footer className="footer mt-auto py-3 container-fluid bg-dark text-white">
        <div className="container">
          Copyright © 2020 Stiletto.
          <a
            href="https://github.com/dm94/stiletto-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Github project")}
          </a>
          {" | "}|{" "}
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
      </footer>
      <CookieConsent
        location="bottom"
        buttonText="Let´s GO!!"
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

function discordButton(t) {
  if (
    localStorage.getItem("discordid") != null &&
    localStorage.getItem("token") != null
  ) {
    return (
      <Link className="btn btn-outline-light d-none d-sm-block" to="/profile">
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
      <a className="btn btn-outline-light d-none d-sm-block" href={urlLink}>
        <i className="fab fa-discord"></i> {t("Login with discord")}
      </a>
    );
  }
}

export default CrafterApp;
