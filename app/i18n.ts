import i18n from "i18next";

import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "./config/config";
import { supportedLanguages } from "./config/languages";

const languageWhitelist = supportedLanguages.map((lang) => lang.key);

i18n.use(initReactI18next).init({
  fallbackLng: DEFAULT_LANGUAGE,
  debug: false,
  preload: [DEFAULT_LANGUAGE],
  ns: ["translation", "items"],
  defaultNS: "translation",
  supportedLngs: languageWhitelist,
});

export default i18n;
