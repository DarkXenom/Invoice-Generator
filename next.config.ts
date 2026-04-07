import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {},
  webpack: (config) => {
    // Fix for pdfjs-dist canvas dependency
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
