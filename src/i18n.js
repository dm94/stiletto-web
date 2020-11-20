import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./lng/en";
import es from "./lng/es";
import ru from "./lng/ru";

i18n.use(LanguageDetector).init({
  resources: {
    en: en,
    es: es,
    ru: ru,
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
