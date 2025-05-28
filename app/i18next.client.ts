import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import { DEFAULT_LANGUAGE } from "./config/config";
import { supportedLanguages } from "./config/languages";

const languageWhitelist = supportedLanguages.map((lang) => lang.key);

i18n
  .use(HttpBackend) // Registering the HttpBackend
  .use(initReactI18next) // Registering react-i18next
  .init({
    supportedLngs: languageWhitelist,
    defaultNS: "translation",
    fallbackLng: DEFAULT_LANGUAGE,
    // The namespaces you plan to use in your route components
    ns: getInitialNamespaces(),
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    debug: process.env.NODE_ENV === "development", // Enable debug output in development
  });

export default i18n;
