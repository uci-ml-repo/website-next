import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dataset/:id",
        destination: "/datasets/:id",
        permanent: true,
      },
      {
        source: "/dataset/:id/:slug",
        destination: "/datasets/:id/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
