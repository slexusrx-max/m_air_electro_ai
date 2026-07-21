import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const scriptPolicy = isDevelopment ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; script-src ${scriptPolicy}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https: ws: wss:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
