
import nextI18NextConfig from './next-i18next.config.js';
const { i18n } = nextI18NextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: './build',
  i18n,
}

export default nextConfig