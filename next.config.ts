import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Frontend',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
