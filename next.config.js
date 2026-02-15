/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
    // Disable features that might cause memory issues
    optimizeCss: false,
  },
  // Increase build timeout
  staticPageGenerationTimeout: 300,
  // Ensure trailing slashes don't cause issues
  trailingSlash: false,
  // Disable powered by header
  poweredByHeader: false,
}

module.exports = nextConfig
