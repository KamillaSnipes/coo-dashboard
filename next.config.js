/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'hc-coo-dashboard-2026-secret-f8a9b2c3d4e5',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://web-production-9c7bc.up.railway.app',
  },
}

module.exports = nextConfig

