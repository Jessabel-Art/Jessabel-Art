import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid inferring the project root from a parent folder's lockfile.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
