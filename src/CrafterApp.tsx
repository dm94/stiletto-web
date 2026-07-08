import { useWebMCP, useWebMCPContext } from "@mcp-b/react-webmcp";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import i18next from "i18next";
import { z } from "zod";
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
import { PostHogPageView } from "@components/PostHogProvider";
import PWAReloadPrompt from "@components/PWAReloadPrompt";

const APP_PAGES = [
  "home",
  "crafter",
  "clanlist",
  "maps",
  "trades",
  "diplomacy",
  "auctions",
  "map",
  "tech",
  "perks",
  "wiki",
  "item",
  "creature",
] as const;

const NAVIGATE_DESCRIPTION = `Navigate to a Stiletto Web page. Available pages: ${APP_PAGES.join(", ")}`;

const CrafterApp: React.FC = () => {
  const navigate = useNavigate();
  const [showChangeLanguageModal, setShowChangeLanguageModal] =
    useState<boolean>(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  usePageTracking();

  const language = getStoredItem("i18nextLng");

  useWebMCPContext(
    "stiletto_context",
    "Current Stiletto Web app state: active language and current page path",
    () => ({
      language: language ?? "en",
      currentPath: globalThis.location.pathname,
    }),
  );

  useWebMCP({
    name: "stiletto_navigate",
    description: NAVIGATE_DESCRIPTION,
    inputSchema: {
      page: z.enum(APP_PAGES).describe("Target page name"),
    },
    outputSchema: {
      success: z.boolean(),
      page: z.string(),
    },
    annotations: {
      title: "Navigate to Page",
      readOnlyHint: false,
      idempotentHint: true,
    },
    handler: async ({ page }) => {
      const path = page === "home" ? "/" : `/${page}`;
      navigate(path);
      return { success: true, page };
    },
    formatOutput: (result) => `Navigated to ${result.page}`,
  });

  if (redirectTo != null) {
    navigate(redirectTo);
    setRedirectTo(null);
  }

  return (
    <UserProvider>
      <PostHogPageView />
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
      <main className="shrink-0">
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
      <PWAReloadPrompt />
    </UserProvider>
  );
};

function switchLanguage(lng: string): void {
  storeItem("i18nextLng", lng);
  i18next.changeLanguage(lng);

  const currentPath = globalThis.location.pathname;
  const pathSegments = currentPath.split("/").filter(Boolean);

  const supportedLangCodes = supportedLanguages.map((lang) => lang.key);
  const firstSegment = pathSegments[0];

  if (firstSegment && supportedLangCodes.includes(firstSegment)) {
    pathSegments[0] = lng;
    const normalizedPath = `/${pathSegments.join("/")}`;
    globalThis.location.href = `${normalizedPath.replaceAll(/\/+/g, "/")}${globalThis.location.search}`;
  } else {
    const normalizedPath = `/${lng}${currentPath}`;
    globalThis.location.href = `${normalizedPath.replaceAll(/\/+/g, "/")}${globalThis.location.search}`;
  }
}

export default CrafterApp;
