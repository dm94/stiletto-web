"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CookieConsent from "../components/CookieConsent";
import Menu from "../components/Menu";
import ChangeLanguageModal from "../components/ChangeLanguageModal";
import Footer from "../components/Footer";
import NotificationList from "../components/Notifications/NotificationList";
import { getStoredItem, storeItem } from "../functions/services";

interface CrafterLayoutProps {
  children: React.ReactNode;
}

const CrafterLayout: React.FC<CrafterLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [showChangeLanguageModal, setShowChangeLanguageModal] =
    useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("en");

  // Initialize language from localStorage on client side
  useEffect(() => {
    const storedLanguage = getStoredItem("i18nextLng");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Handle redirects
  useEffect(() => {
    if (redirectTo !== null) {
      router.push(redirectTo);
      setRedirectTo(null);
    }
  }, [redirectTo, router]);

  // Function to switch language
  const switchLanguage = (lng: string): void => {
    storeItem("i18nextLng", lng);
    setLanguage(lng);
    // In Next.js, we would typically use i18n routing instead of i18next directly
    // This is a placeholder for the i18next functionality
    // i18next.changeLanguage(lng);
  };

  return (
    <>
      {/* In Next.js, we would use next/head instead of Helmet */}
      <Menu
        language={language ?? "en"}
        openLanguajeModal={() => {
          setShowChangeLanguageModal(true);
        }}
        setRedirectTo={(value: string) => setRedirectTo(value)}
      />
      <main className="flex-shrink-0">
        <div className="container-fluid pt-4">
          {children}
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
    </>
  );
};

export default CrafterLayout;
