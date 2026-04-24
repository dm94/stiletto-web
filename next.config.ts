import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using an empty turbopack config as suggested to silence the error
  // while we rely on native path mapping in tsconfig.json
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/dm94/stiletto-web/**',
      },
    ],
  },
};

export default nextConfig;
