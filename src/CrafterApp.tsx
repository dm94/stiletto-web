import React, { useState } from "react";
import { useNavigate } from "react-router";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import CookieConsent from "./components/CookieConsent";
import Menu from "./components/Menu";
import ChangeLanguageModal from "./components/ChangeLanguageModal";
import { getStoredItem, storeItem } from "./functions/services";
import AppRoutes from "./router";
import { usePageTracking } from "./page-tracking";
import NotificationList from "./components/Notifications/NotificationList";
import Footer from "./components/Footer";

const CrafterApp: React.FC = () => {
  const navigate = useNavigate();
  const [showChangeLanguageModal, setShowChangeLanguageModal] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  usePageTracking();

  const language = getStoredItem("i18nextLng");

  if (redirectTo != null) {
    navigate(redirectTo);
    setRedirectTo(null);
  }

  return (
    <React.Fragment>
      <Helmet
        htmlAttributes={{
          lang: language ?? "en",
        }}
      />
      <Menu
        language={language ?? "en"}
        openLanguajeModal={() => {
          setShowChangeLanguageModal(true);
        }}
        setRedirectTo={(value: string) => setRedirectTo(value)}
      />
      <main className="flex-shrink-0">
        <div className="container-fluid pt-4">
          {AppRoutes}
          {showChangeLanguageModal && (
            <ChangeLanguageModal
              switchLanguage={(lng: string) => switchLanguage(lng)}
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

function switchLanguage(lng: string): void {
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);
}

export default CrafterApp;