import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      { source: "/giveaway", destination: "/", permanent: true },
      { source: "/better-chat", destination: "/", permanent: true },
      { source: "/better-chat/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
