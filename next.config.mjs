/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: './build',
  // Using middleware.ts for i18n routing instead of the legacy i18n config
  // This approach is compatible with 'output: export'
}

export default nextConfig;