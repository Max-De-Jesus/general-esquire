import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  generateBuildId: async () => "build",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
