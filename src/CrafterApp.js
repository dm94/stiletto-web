import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import * as serviceWorker from "./serviceWorkerRegistration";
import CookieConsent from "./components/CookieConsent";
import Menu from "./components/Menu";
import ChangeLanguageModal from "./components/ChangeLanguageModal";
import { getStoredItem, storeItem } from "./services";
import Routes from "./router";
import { usePageTracking } from "./page-tracking";
import "./css/style.min.css";
import NotificationList from "./components/Notifications/NotificationList";

const CrafterApp = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const [showChangeLanguageModal, setChangeLanguageModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  serviceWorker.register({
    onUpdate: () => {
      updateWeb();
    },
  });

  usePageTracking();

  const language = getStoredItem("i18nextLng");

  if (redirectTo != null) {
    history.push(redirectTo);
    setRedirectTo(null);
  }

  return (
    <React.Fragment>
      <Helmet
        htmlAttributes={{
          lang: language ? language : "en",
        }}
      >
        <link
          rel="stylesheet"
          href={
            getStoredItem("darkmode") !== "false"
              ? "/css/darkly.min.css"
              : "/css/journal.min.css"
          }
        />
      </Helmet>
      <Menu
        language={language}
        openLanguajeModal={() => {
          setChangeLanguageModal(true);
        }}
        setRedirectTo={(value) => setRedirectTo(value)}
      />
      <main role="main" className="flex-shrink-0">
        <div className="container-fluid pt-4">
          {Routes}
          {showChangeLanguageModal && (
            <ChangeLanguageModal
              switchLanguage={(lng) => switchLanguage(lng)}
              hideModal={() => setChangeLanguageModal(false)}
            />
          )}
        </div>
      </main>
      <footer className="footer footer mt-auto">
        <div className="container-fluid py-3 bg-dark text-white">
          <div className="row">
            <div className="col-xl-10">
              © 2020-2023 Dm94Dani{" | "}{" "}
              <Link className="text-white" to="/privacy">
                {t("Privacy Policy")}
              </Link>{" "}
              {" | "}
              <a
                title="GitHub package.json version"
                href="https://github.com/dm94/stiletto-web"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  width="104"
                  height="20"
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
                  width="140"
                  height="20"
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
                  width="94"
                  height="20"
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
      <NotificationList />
    </React.Fragment>
  );
};

function updateWeb() {
  localStorage.removeItem("allItems");
  sessionStorage.removeItem("allItems");
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  });
  window.location.reload();
}

function switchLanguage(lng) {
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);
}

function darkMode(t) {
  if (getStoredItem("darkmode") !== "false") {
    return (
      <button
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          storeItem("darkmode", false);
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
          storeItem("darkmode", true);
          window.location.reload();
        }}
      >
        <i className="far fa-moon"></i> {t("Dark Theme Mode")}
      </button>
    );
  }
}

export default CrafterApp;
