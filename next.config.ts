import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linked-posts.routemisr.com",
        pathname: "/uploads/**"
      }
    ]
  }
};
module.exports = {
  trailingSlash: true, // Optional: adds a trailing slash to all routes
};
export default nextConfig;
