/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import next-i18next configuration
import nextI18NextConfig from './next-i18next.config.js';

const nextConfig = {
  output: 'export',
  distDir: './build',
  // i18n config is now handled by next-i18next and cannot be used with output: 'export'
  // Using the i18n from next-i18next.config.js instead
  // This is needed for static export with i18n
  trailingSlash: true,
}

export default nextConfig;