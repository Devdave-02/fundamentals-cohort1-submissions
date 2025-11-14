import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    LOCAL_BACKEND_URL: process.env.LOCAL_BACKEND_URL,
    API_TIMEOUT: process.env.API_TIMEOUT,
  },
};

export default nextConfig;
