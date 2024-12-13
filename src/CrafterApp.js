import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import * as serviceWorker from "./serviceWorkerRegistration";
import CookieConsent from "./components/CookieConsent";
import Menu from "./components/Menu";
import ChangeLanguageModal from "./components/ChangeLanguageModal";
import { getStoredItem, storeItem } from "./functions/services";
import Routes from "./router";
import { usePageTracking } from "./page-tracking";
import { isDarkMode } from "./functions/utils";
import NotificationList from "./components/Notifications/NotificationList";

const CrafterApp = () => {
  if (isDarkMode()) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }

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
          lang: language ?? "en",
        }}
      >
      </Helmet>
      <Menu
        language={language}
        openLanguajeModal={() => {
          setChangeLanguageModal(true);
        }}
        setRedirectTo={(value) => setRedirectTo(value)}
      />
      <main className="flex-shrink-0">
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
              By Dm94Dani{" | "}{" "}
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
                "This website uses utilities related to the game 'Last Oasis' but is not affiliated with",
              )}{" "}
              <a
                href="https://www.donkey.team/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donkey Crew
              </a>
            </div>
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
  if (window?.caches) {
    window?.caches?.keys().then((names) => {
      for (const name of names) {
        if (name.includes("lastCheck")) {
          caches?.delete(name);
        }
      }
    });
  }
  window.location.reload();
}

function switchLanguage(lng) {
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);
}

function darkMode(t) {
  if (isDarkMode()) {
    return (
      <button
        type="button"
        className="btn btn-sm btn-outline-light"
        onClick={() => {
          storeItem("darkmode", false);
          document.documentElement.setAttribute("data-theme", "light");
          window.location.reload();
        }}
      >
        <i className="far fa-sun" /> {t("Light Theme Mode")}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-light"
      onClick={() => {
        storeItem("darkmode", true);
        document.documentElement.setAttribute("data-theme", "dark");
        window.location.reload();
      }}
    >
      <i className="far fa-moon" /> {t("Dark Theme Mode")}
    </button>
  );

}

export default CrafterApp;
