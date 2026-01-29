import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: false, // Enable in dev for testing
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
