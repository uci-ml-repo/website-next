import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "**.aws.uci.edu" },
    ],
  },
  turbopack: {},
  experimental: {
    mdxRs: true,
    authInterrupts: true,
  },
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/datasets.php",
        destination: "/datasets",
        permanent: true,
      },
      {
        source: "/static/public/:path*",
        destination: "/api/static/:path*",
        permanent: true,
      },
    ];
  },
};

export default createMDX()(nextConfig);
