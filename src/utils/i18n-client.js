import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import nextI18NextConfig from '../../next-i18next.config.js';

// Initialize i18next for client-side
if (!i18n.isInitialized) {
  i18n
    .use(Backend) // Load translations using http (default public/locales)
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n down to react-i18next
    .init({
      ...nextI18NextConfig.i18n,
      ns: nextI18NextConfig.ns,
      defaultNS: nextI18NextConfig.defaultNS,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;