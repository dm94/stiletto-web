import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "./config/config";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    debug: false,
    preload: [DEFAULT_LANGUAGE],
    ns: ["translation", "items"],
    defaultNS: "translation",
    detection: {
      // Detection order: first URL, then localStorage, etc.
      order: ["path", "localStorage", "navigator"],
      // Look for language in the path like /es/, /en/, etc.
      lookupFromPathIndex: 0,
      // Convert everything to lowercase
      convertPathToLanguage: (lng: string) => lng.toLowerCase(),
      // Save the language in localStorage when detected from URL
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      crossDomain: true,
    },
  });

export default i18n;
