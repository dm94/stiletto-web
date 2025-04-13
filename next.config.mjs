/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './build', // Changes the build output directory to `./dist/`.

  // Note: i18n configuration has been removed as it's not compatible with 'output: export'
  // Internationalization is now handled through route segments in the app directory
  // and the middleware.ts file for language detection
}

export default nextConfig