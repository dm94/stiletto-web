const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ru', 'fr', 'de', 'it', 'ja', 'pl', 'zh', 'pt', 'uk', 'ca', 'ko', 'tr'],
    localeDetection: true,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  ns: ['translation', 'items'],
  defaultNS: 'translation',
}

export default config;