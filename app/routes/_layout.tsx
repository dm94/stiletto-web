import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import VanillaCookieConsent from "@components/VanillaCookieConsent";
import Menu from "@components/Menu";
import ChangeLanguageModal from "@components/ChangeLanguageModal";
import { getStoredItem } from "@functions/services";
import { usePageTracking } from "@functions/page-tracking";
import NotificationList from "@components/Notifications/NotificationList";
import Footer from "@components/Footer";
import { UserProvider } from "@store/userStore";

export default function Layout() {
  const [showChangeLanguageModal, setShowChangeLanguageModal] = useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  usePageTracking();

  const language = getStoredItem("i18nextLng");

  return (
    <UserProvider>
      <>
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
            <Outlet />
            {showChangeLanguageModal && (
              <ChangeLanguageModal
                show={showChangeLanguageModal}
                onClose={() => setShowChangeLanguageModal(false)}
              />
            )}
          </div>
        </main>
        <Footer />
        <NotificationList />
        <VanillaCookieConsent />
      </>
    </UserProvider>
  );
}