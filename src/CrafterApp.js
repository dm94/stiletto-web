import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import * as serviceWorker from "./serviceWorkerRegistration";
import CookieConsent from "./components/CookieConsent";
import Menu from "./components/Menu";
import { getStoredItem, storeItem } from "./services";
import Routes from "./router";
import { usePageTracking } from "./page-tracking";
import "./css/style.min.css";

const CrafterApp = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const [showChangeLanguageModal, setChangeLanguageModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const showHideClassName = showChangeLanguageModal
    ? "modal d-block"
    : "modal d-none";
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
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/zh.jpg"
                        alt="Chinese Simplified language"
                        onClick={() => switchLanguage("zh")}
                      />
                      <p>{t("Chinese Simplified")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/it.jpg"
                        alt="Italian language"
                        onClick={() => switchLanguage("it")}
                      />
                      <p>{t("Italian")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/ja.jpg"
                        alt="Japanese language"
                        onClick={() => switchLanguage("ja")}
                      />
                      <p>{t("Japanese")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/pl.jpg"
                        alt="Polish language"
                        onClick={() => switchLanguage("pl")}
                      />
                      <p>{t("Polish")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/pt.jpg"
                        alt="Portuguese language"
                        onClick={() => switchLanguage("pt")}
                      />
                      <p>{t("Portuguese, Brazilian")}</p>
                    </div>
                    <div className="col-3">
                      <img
                        className="img-thumbnail"
                        src="/img/uk.jpg"
                        alt="Ukrainian language"
                        onClick={() => switchLanguage("uk")}
                      />
                      <p>{t("Ukrainian")}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <p className="mr-auto">v4.4.3</p>
                  <button
                    className={
                      getStoredItem("darkmode") !== "true"
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
