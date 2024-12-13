import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { getStoredItem } from "./functions/services";

i18n.use(HttpApi).init({
  lng: getStoredItem("i18nextLng"),
  fallbackLng: "en",
  debug: false,
  preload: ["en"],
  keySeparator: false,

  ns: ["translation", "items"],
  defaultNS: "translation",
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    crossDomain: true,
  },

  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;
