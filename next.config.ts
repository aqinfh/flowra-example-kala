import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // remotePatterns is only needed if you remove `unoptimized` from components/photo.tsx.
    remotePatterns: [{ protocol: "https", hostname: "demo.withflowra.com", pathname: "/api/img/**" }],
  },
  // Scaffold wiring that runs Tailwind CSS v4 through Turbopack; without it `@theme` is not processed.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
