import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ideogram.ai",
      },
      {
        protocol: "https", // NUEVO: Configuración para QR server
        hostname: "api.qrserver.com",
      },
    ],
    // domains: ['api.qrserver.com'], // ❌ ELIMINAR esta línea obsoleta
  },
};

export default nextConfig;