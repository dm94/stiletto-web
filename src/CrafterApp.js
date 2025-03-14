import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import CookieConsent from "./components/CookieConsent";
import Menu from "./components/Menu";
import ChangeLanguageModal from "./components/ChangeLanguageModal";
import { getStoredItem, storeItem } from "./functions/services";
import Routes from "./router";
import { usePageTracking } from "./page-tracking";
import NotificationList from "./components/Notifications/NotificationList";
import Footer from "./components/Footer";

const CrafterApp = () => {
  const history = useHistory();
  const [showChangeLanguageModal, setShowChangeLanguageModal] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

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
          setShowChangeLanguageModal(true);
        }}
        setRedirectTo={(value) => setRedirectTo(value)}
      />
      <main className="flex-shrink-0">
        <div className="container-fluid pt-4">
          {Routes}
          {showChangeLanguageModal && (
            <ChangeLanguageModal
              switchLanguage={(lng) => switchLanguage(lng)}
              hideModal={() => setShowChangeLanguageModal(false)}
            />
          )}
        </div>
      </main>
      <Footer />
      <CookieConsent />
      <NotificationList />
    </React.Fragment>
  );
};


function switchLanguage(lng) {
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);
}

export default CrafterApp;
