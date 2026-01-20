/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'headcorn-super-secret-key-2026-dashboard-coo',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://web-production-9c7bc.up.railway.app',
  },
}

module.exports = nextConfig

