import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Amplify publishes static files; local builds can still use `next start`.
  output: process.env.STATIC_EXPORT === "true" ? "export" : undefined,
  trailingSlash: true,
  agentRules: false,
};

export default nextConfig;
