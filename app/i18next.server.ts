import FSBackend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next/server";
import { DEFAULT_LANGUAGE } from "./config/config";
import { supportedLanguages } from "./config/languages";

const languageWhitelist = supportedLanguages.map((lang) => lang.key);

export const i18nInstance = new RemixI18Next({
  detection: {
    supportedLanguages: languageWhitelist,
    fallbackLanguage: DEFAULT_LANGUAGE,
  },
  // This is the configuration for i18next used when translating messages
  // on the server only, optional but recommended - RemixI18Next will pass
  // an instance of i18next initialized with this configuration to the
  // loader and action arguments of your routes.
  i18next: {
    backend: {
      loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
    supportedLngs: languageWhitelist,
    fallbackLng: DEFAULT_LANGUAGE,
    ns: ["translation", "items"],
    defaultNS: "translation",
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: FSBackend,
});

export default i18nInstance;
