/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.google.com', 'api.qrserver.com'],
    unoptimized: true
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  }
}

module.exports = nextConfig
