import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "./config/config";
import { supportedLanguages } from "./config/languages";

const languageWhitelist = supportedLanguages.map((lang) => lang.key);

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
    supportedLngs: languageWhitelist,
    detection: {
      order: ["localStorage", "navigator"],
      convertPathToLanguage: (lng: string) => lng.toLowerCase(),
      caches: ["localStorage"],
      checkWhitelist: true,
      skipRouteLocalizationIfPathContainsLocale: true,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      crossDomain: true,
    },
  });

export default i18n;
