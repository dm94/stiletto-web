import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./src"),
      "@functions": path.resolve(__dirname, "./src/functions"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/views"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@ctypes": path.resolve(__dirname, "./src/types"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    };
    return config;
  },
  images: {
    unoptimized: true, // For static export if needed, or just keep it simple for now
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
