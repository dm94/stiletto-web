import i18n from "i18next";
import HttpApi from "i18next-http-backend";

i18n.use(HttpApi).init({
  lng: localStorage.getItem("i18nextLng"),
  fallbackLng: "en",
  debug: false,
  preload: ["en", "es", "de", "fr", "ru"],
  keySeparator: false,

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
