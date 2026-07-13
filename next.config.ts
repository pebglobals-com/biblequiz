import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  env: {
    OPENCODE_API_KEY: process.env.OPENCODE_API_KEY || "",
  },
};

export default nextConfig;
