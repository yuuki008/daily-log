import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.com",
      },
      {
        protocol: "https",
        hostname: "*.supabasepublic.com",
      },
      // Add other image CDN domains as needed
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.pexels.com",
      },
    ],
  },
};

export default nextConfig;
