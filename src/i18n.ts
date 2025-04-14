import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

if (typeof window !== "undefined" && !i18n.isInitialized) {
  i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en",
      debug: process.env.NODE_ENV === "development",
      preload: ["en"],
      ns: ["translation", "items"],
      defaultNS: "translation",
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        crossDomain: true,
      },
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false, // React already escapes values
      },
    });
}

export default i18n;
