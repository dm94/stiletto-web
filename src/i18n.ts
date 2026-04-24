import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "./config/config";
import { supportedLanguages } from "./config/languages";

const languageWhitelist = supportedLanguages.map((lang) => lang.key);

// For Next.js SSG/SSR, we need a way to initialize i18n on the server
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
      backend: {
        // Use absolute URL during build if possible, or relative path for client
        loadPath: typeof window === 'undefined'
          ? `http://localhost:3000/locales/{{lng}}/{{ns}}.json`
          : "/locales/{{lng}}/{{ns}}.json",
        crossDomain: true,
      },
    });
}

export default i18n;
