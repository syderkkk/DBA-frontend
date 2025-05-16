import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ideogram.ai",
      },
    ],
  },
};

export default nextConfig;