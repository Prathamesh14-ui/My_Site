import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // CMS content: refresh in the background at most once a minute; the
  // /api/revalidate webhook can refresh instantly.
  cacheLife: {
    cms: { stale: 60, revalidate: 60, expire: 60 * 60 * 24 },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
  },
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
