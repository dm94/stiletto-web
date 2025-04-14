import path from 'node:path';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../../next-i18next.config.js';

/**
 * Helper function to use in getStaticProps or getServerSideProps
 * to load translations on the server side
 * 
 * @param {string} locale - The locale to load translations for
 * @param {string[]} namespaces - Array of namespaces to load
 * @returns {Promise<object>} - The translation props
 */
export async function getI18nProps(locale, namespaces = ['common', 'translation', 'items']) {
  const localeFolder = path.join(process.cwd(), 'public', 'locales');

  return {
    ...(await serverSideTranslations(locale, namespaces, nextI18NextConfig, localeFolder))
  };
}

/**
 * Helper function to get all locale paths for getStaticPaths
 * 
 * @param {string[]} paths - Array of paths without locale prefix
 * @returns {object[]} - Array of path objects with locale and path
 */
export function getAllLocalePaths(paths = ['']) {
  const { locales } = nextI18NextConfig.i18n;

  return locales.flatMap(locale =>
    paths.map(path => ({
      params: {
        locale,
        path: path === '' ? [] : path.split('/'),
      },
    }))
  );
}