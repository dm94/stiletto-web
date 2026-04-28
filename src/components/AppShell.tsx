"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import i18next from "i18next";
import Menu from "@components/Menu";
import ChangeLanguageModal from "@components/ChangeLanguageModal";
import VanillaCookieConsent from "@components/VanillaCookieConsent";
import NotificationList from "@components/Notifications/NotificationList";
import Footer from "@components/Footer";
import { UserProvider } from "@store/userStore";
import { PostHogPageView } from "@components/PostHogProvider";
import { useLanguagePrefix } from "@hooks/useLanguagePrefix";
import { usePageTracking } from "@functions/page-tracking";
import "../i18n";

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { getLanguagePrefixedPath, getCurrentLanguage } = useLanguagePrefix();
  const [showChangeLanguageModal, setShowChangeLanguageModal] =
    useState<boolean>(false);

  usePageTracking();

  const language = getCurrentLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <UserProvider>
      <PostHogPageView />
      <Menu
        language={language}
        openLanguajeModal={() => setShowChangeLanguageModal(true)}
        setRedirectTo={(url: string) => {
          router.push(getLanguagePrefixedPath(url));
        }}
      />
      <main className="shrink-0">
        <div className="container-fluid pt-4">
          {children}
          {showChangeLanguageModal && (
            <ChangeLanguageModal
              switchLanguage={(lng: string) => {
                localStorage.setItem("i18nextLng", lng);
                i18next.changeLanguage(lng);
                router.replace(`/${lng}`);
              }}
              hideModal={() => setShowChangeLanguageModal(false)}
            />
          )}
        </div>
      </main>
      <Footer />
      <VanillaCookieConsent />
      <NotificationList />
    </UserProvider>
  );
}
