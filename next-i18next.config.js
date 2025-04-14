// @ts-check

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = typeof window === 'undefined' ? path.dirname(fileURLToPath(import.meta.url)) : undefined;

/**
 * @type {import('next-i18next').UserConfig}
 */
export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'ru', 'fr', 'de', 'it', 'ja', 'pl', 'zh', 'ca', 'pt', 'tr', 'uk'],
  localeDetection: true,
}

export default {
  i18n,
  localePath: typeof window === 'undefined' ? path.join(__dirname, './public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}