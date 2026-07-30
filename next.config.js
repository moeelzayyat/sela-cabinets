const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.SELA_TEST_DIST_DIR || '.next',
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'shop.alinecabinets.com',
      },
    ],
  },
  // Disable experimental features that might cause issues
  experimental: {
    // Validate required server environment before accepting requests.
    instrumentationHook: true,
    // Disable features that might cause memory issues
    optimizeCss: false,
  },
  // Increase build timeout
  staticPageGenerationTimeout: 300,
  // Ensure trailing slashes don't cause issues
  trailingSlash: false,
  // Disable powered by header
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    return config
  },
}

module.exports = nextConfig
