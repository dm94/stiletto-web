/** @type {import('next').NextConfig} */

// Import next-i18next configuration
import nextI18NextConfig from './next-i18next.config.js';

const nextConfig = {
  output: 'export',
  distDir: './build',
  // i18n config cannot be used with 'output: export'
  // Using next-i18next for internationalization instead
  // The i18n configuration is handled in _app.js with appWithTranslation
  trailingSlash: true,
}

export default nextConfig;