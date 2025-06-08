import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UCI Machine Learning Repository",
    short_name: "UCI ML Repo",
    description: "UCI Repository for Machine Learning Datasets",
    display: "standalone",
    icons: [
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
