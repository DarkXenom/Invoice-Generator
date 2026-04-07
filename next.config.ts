import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {},
  serverExternalPackages: [],
  transpilePackages: ['@react-pdf/renderer', '@react-pdf/layout', '@react-pdf/pdfkit', '@react-pdf/primitives'],
  webpack: (config) => {
    // Fix for pdfjs-dist canvas dependency
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
