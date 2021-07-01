import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Analytics from "react-router-ga";
import i18next from "i18next";
import Crafter from "./pages/Crafter";
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
import TechTree from "./pages/TechTree";
import QualityCalculator from "./pages/QualityCalculator";
import ModalMessage from "./components/ModalMessage";
import { Helmet } from "react-helmet";
import * as serviceWorker from "./serviceWorkerRegistration";
import CookieConsent from "./components/CookieConsent";
import DiscordButton from "./components/DiscordButton";
import ResourceMapNoLog from "./components/ResourceMapNoLog";
import "./css/style.min.css";

function CrafterApp() {
  const [t] = useTranslation();
  const [showChangeLanguageModal, setChangeLanguageModal] = useState(false);
  const [newUpdate, setUpdateModal] = useState(false);
  let showHideClassName = showChangeLanguageModal
    ? "modal d-block"
    : "modal d-none";
  let showUpdateModal = newUpdate ? "modal d-block" : "modal d-none";
  serviceWorker.register({
    onUpdate: () => {
      setUpdateModal(true);
    },
  });

  return (
    <Router>
      <Helmet>
        <link
          rel="stylesheet"
          href={
            localStorage.getItem("darkmode") !== "false"
              ? "/css/darkly.min.css"
              : "/css/journal.min.css"
          }
        />
      </Helmet>
      <header>
        <div className="navbar navbar-expand-md navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <span>Stiletto</span>.live
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbar-main-menu"
              aria-controls="navbar-main-menu"
              aria-expanded="false"
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                role="img"
                focusable="false"
              >
                <title>{t("Menu")}</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                ></path>
              </svg>
            </button>
            <div className="collapse navbar-collapse" id="navbar-main-menu">
              <ul className="navbar-nav mr-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/crafter">
                    {t("Crafting")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={
                      localStorage.getItem("discordid") != null
                        ? "/maps"
                        : "/map"
                    }
                  >
                    {t("Resource Maps")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/clanlist">
                    {t("Clan List")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trades">
                    {t("Trades")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/auctions">
                    {t("Auction Timers")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/quality">
                    {t("Quality")}
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
                      ? "/img/es.jpg"
                      : localStorage.getItem("i18nextLng").includes("ru")
                      ? "/img/ru.jpg"
                      : localStorage.getItem("i18nextLng").includes("fr")
                      ? "/img/fr.jpg"
                      : localStorage.getItem("i18nextLng").includes("de")
                      ? "/img/de.jpg"
                      : "/img/en.jpg"
                  }
                  alt="Change language"
                />
              </button>
              <DiscordButton />
            </div>
          </div>
        </div>
      </header>
      <main role="main" className="flex-shrink-0">
        <div className="container-fluid pt-4">
          <Analytics id={process.env.REACT_APP_GA_ID}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/profile" component={DiscordConnection} />
              <Route path="/crafter" component={Crafter} />
              <Route path="/members" component={MemberList} />
              <Route path="/clanlist" component={ClanList} />
              <Route path="/walkerlist" component={WalkerList} />
              <Route path="/maps" component={ClanMaps} />
              <Route path="/trades" component={TradeSystem} />
              <Route path="/diplomacy" component={Diplomacy} />
              <Route path="/auctions" component={AuctionTimers} />
              <Route path="/others" component={Others} />
              <Route path="/map/:id" component={ResourceMapNoLog} />
              <Route path="/map" component={Map} />
              <Route path="/quality" component={QualityCalculator} />
              <Route path="/tech" component={TechTree} />
              <Route path="*">
                <ModalMessage
                  message={{
                    isError: true,
                    text: t("The page you are looking for does not exist"),
                    redirectPage: "/",
                  }}
                />
              </Route>
            </Switch>
          </Analytics>
          <div className={showUpdateModal}>
            <div className="modal-dialog border border-success">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("New web update")}</h5>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setUpdateModal(false);
                    }}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => updateWeb()}
                  >
                    {t("Update")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={showHideClassName}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">{t("Change language")}</div>
                <div className="modal-body">
                  <div className="row text-center">
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/es.jpg"
                        alt="Spanish language"
                        onClick={() => switchLanguage("es")}
                      />
                      <p>{t("Spanish")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/en.jpg"
                        alt="English language"
                        onClick={() => switchLanguage("en")}
                      />
                      <p>{t("English")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/ru.jpg"
                        alt="Russian language"
                        onClick={() => switchLanguage("ru")}
                      />
                      <p>{t("Russian")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/fr.jpg"
                        alt="French language"
                        onClick={() => switchLanguage("fr")}
                      />
                      <p>{t("French")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/de.jpg"
                        alt="German language"
                        onClick={() => switchLanguage("de")}
                      />
                      <p>{t("German")}</p>
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
        </div>
      </main>
      <footer className="footer footer mt-auto">
        <div className="container-fluid py-3 bg-dark text-white">
          <div className="row">
            <div className="col-xl-10">
              Copyright © 2020 Stiletto{" | "}
              <a
                title="GitHub package.json version"
                href="https://github.com/dm94/stiletto-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="GitHub package.json version"
                  src="https://img.shields.io/github/package-json/v/dm94/stiletto-web"
                />
              </a>
              {" | "}
              <a
                title="GitHub last commit"
                href="https://github.com/dm94/stiletto-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="GitHub last commit"
                  src="https://img.shields.io/github/last-commit/dm94/stiletto-web"
                />
              </a>
              {" | "}
              <a
                title="Crowdin"
                target="_blank"
                rel="noopener noreferrer"
                href="https://crowdin.com/project/stiletto"
              >
                <img
                  alt="Crowdin translations"
                  src="https://badges.crowdin.net/stiletto/localized.svg"
                />
              </a>
              {" | "}
              {t(
                "This website uses utilities related to the game 'Last Oasis' but is not affiliated with"
              )}{" "}
              <a
                href="https://www.donkey.team/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donkey Crew
              </a>
            </div>
            <div className="col-xl-2">{darkMode(t)}</div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </Router>
  );
}

function updateWeb() {
  localStorage.removeItem("allItems");
  caches.keys().then(function (names) {
    for (let name of names) {
      caches.delete(name);
    }
  });
  window.location.reload();
}

function switchLanguage(lng) {
  i18next.changeLanguage(lng);
}

function darkMode(t) {
  if (localStorage.getItem("darkmode") !== "false") {
    return (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          localStorage.setItem("darkmode", false);
          window.location.reload();
        }}
      >
        <i className="far fa-sun"></i> {t("Light Theme Mode")}
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          localStorage.setItem("darkmode", true);
          window.location.reload();
        }}
      >
        <i className="far fa-moon"></i> {t("Dark Theme Mode")}
      </button>
    );
  }
}

export default CrafterApp;
