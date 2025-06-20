import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "ideogram.ai",
      },
    ],
    domains: ['api.qrserver.com'],
  },
};

export default nextConfig;