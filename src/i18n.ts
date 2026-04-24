import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "./config/config";
import { supportedLanguages } from "./config/languages";

const languageWhitelist = supportedLanguages.map((lang) => lang.key);

if (!i18n.isInitialized) {
  i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
      fallbackLng: DEFAULT_LANGUAGE,
      debug: false,
      preload: languageWhitelist,
      ns: ["translation", "items", "creatures"],
      defaultNS: "translation",
      supportedLngs: languageWhitelist,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: typeof window === 'undefined'
          ? `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/locales/{{lng}}/{{ns}}.json`
          : "/locales/{{lng}}/{{ns}}.json",
        crossDomain: true,
      },
    });
}

export default i18n;
