import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useState, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import i18next from "./i18next.client"; // your i18n configuration file
import { I18nextProvider, useTranslation } from "react-i18next";

// Define a component that will handle the language change
function ClientI18nSetup() {
  const { i18n } = useTranslation();

  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18next}>
        <ClientI18nSetup />
        <RemixBrowser />
      </I18nextProvider>
    </StrictMode>,
  );
});
