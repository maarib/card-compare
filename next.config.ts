import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/card-compare" : "",
  assetPrefix: isProd ? "/card-compare/" : "",
  images: { unoptimized: true },
};

export default nextConfig;
