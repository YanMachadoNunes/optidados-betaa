import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['192.168.1.38', 'localhost'],
};

export default nextConfig;
