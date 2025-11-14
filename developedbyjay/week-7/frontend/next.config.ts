import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    LOCAL_BACKEND_URL: process.env.LOCAL_BACKEND_URL,
    API_TIMEOUT: process.env.API_TIMEOUT,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
