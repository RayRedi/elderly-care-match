import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      { source: "/examples", destination: "/", permanent: true },
      { source: "/examples/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
