import React, { useState } from "react";
import { useNavigate } from "react-router";
import i18next from "i18next";
import { supportedLanguages } from "@config/languages";
import { Helmet } from "react-helmet";
import VanillaCookieConsent from "@components/VanillaCookieConsent";
import Menu from "@components/Menu";
import ChangeLanguageModal from "@components/ChangeLanguageModal";
import { getStoredItem, storeItem } from "@functions/services";
import AppRoutes from "./router";
import { usePageTracking } from "@functions/page-tracking";
import NotificationList from "@components/Notifications/NotificationList";
import Footer from "@components/Footer";
import { UserProvider } from "@store/userStore";

const CrafterApp: React.FC = () => {
  const navigate = useNavigate();
  const [showChangeLanguageModal, setShowChangeLanguageModal] =
    useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  usePageTracking();

  const language = getStoredItem("i18nextLng");

  if (redirectTo != null) {
    navigate(redirectTo);
    setRedirectTo(null);
  }

  return (
    <UserProvider>
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
        <VanillaCookieConsent />
        <NotificationList />
      </React.Fragment>
    </UserProvider>
  );
};

function switchLanguage(lng: string): void {
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);

  // Redirigir a la misma página pero con el nuevo prefijo de idioma
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split("/").filter(Boolean);

  // Verificar si el primer segmento es un código de idioma
  const supportedLangCodes = supportedLanguages.map((lang) => lang.key);
  const firstSegment = pathSegments[0];

  if (firstSegment && supportedLangCodes.includes(firstSegment)) {
    // Reemplazar el código de idioma actual con el nuevo
    pathSegments[0] = lng;
    window.location.href = `/${pathSegments.join("/")}${window.location.search}`;
  } else {
    // Añadir el código de idioma al inicio de la ruta
    window.location.href = `/${lng}${currentPath}${window.location.search}`;
  }
}

export default CrafterApp;
