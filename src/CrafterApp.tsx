import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router"; // Updated import
import i18next from "i18next";
import { supportedLanguages } from "@config/languages";
import { Helmet } from "react-helmet";
import VanillaCookieConsent from "@components/VanillaCookieConsent";
import Menu from "@components/Menu";
import ChangeLanguageModal from "@components/ChangeLanguageModal";
import { getStoredItem, storeItem } from "@functions/services";
import { usePageTracking } from "@functions/page-tracking";
import NotificationList from "@components/Notifications/NotificationList";
import Footer from "@components/Footer";
// UserProvider removed from here
import { Outlet, useRouterState } from "@tanstack/react-router"; // Added import

const CrafterApp: React.FC = () => {
  const navigate = useNavigate();
  // Get current location and params for language switching
  const location = useRouterState({ select: (s) => s.location });
  const params = useRouterState({ select: (s) => s.params });

  const [showChangeLanguageModal, setShowChangeLanguageModal] =
    useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  usePageTracking();

  const language = getStoredItem("i18nextLng");

  if (redirectTo != null) {
    navigate({ to: redirectTo }); // Updated navigate usage
    setRedirectTo(null);
  }

  return (
    // UserProvider was removed from here
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
          <Outlet /> {/* Replaced AppRoutes with Outlet */}
          {showChangeLanguageModal && (
            <ChangeLanguageModal
              switchLanguage={(newLang: string) => switchLanguage(newLang, location, params)}
              hideModal={() => setShowChangeLanguageModal(false)}
            />
          )}
        </div>
      </main>
      <Footer />
      <VanillaCookieConsent />
      <NotificationList />
    </React.Fragment>
    // UserProvider was removed from here
  );
};

function switchLanguage(lng: string, location: any, routeParams: any): void { // Added location and params
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);

  const { lang, ...otherParams } = routeParams as { lang?: string, [key: string]: string };

  let newPathname = location.pathname;

  // If the first segment is a supported language code, replace it
  const pathSegments = newPathname.split("/").filter(Boolean);
  if (pathSegments.length > 0 && supportedLanguages.some(sl => sl.key === pathSegments[0])) {
    pathSegments[0] = lng;
    newPathname = `/${pathSegments.join("/")}`;
  } else {
    // If no language code is present, or it's not the first segment, prepend the new language code
    newPathname = `/${lng}${newPathname}`;
  }

  newPathname = newPathname.replace(/\/+/g, "/"); // Normalize multiple slashes

  // Keep existing search parameters
  const searchString = location.search;

  // For full reload to ensure all components pick up language change through i18next correctly
  window.location.href = `${newPathname}${searchString}`;
}

export default CrafterApp;
