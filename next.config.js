/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Add experimental flag to support TypeScript config
  experimental: {
    typedRoutes: true,
  },
  // Add any other necessary configuration
  reactStrictMode: true,
  // Allow cross-origin requests during development
  // This fixes the warning about cross-origin requests
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.121.222:3000"],
};

module.exports = nextConfig;
