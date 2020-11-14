import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./lng/en";
import es from "./lng/es";

i18n.use(LanguageDetector).init({
  resources: {
    en: en,
    es: es,
  },
  fallbackLng: "en",
  debug: false,

  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false,

  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },

  react: {
    wait: true,
  },
});

export default i18n;
