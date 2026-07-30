const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://calendly.com",
  "script-src 'self' 'unsafe-inline' https://assets.calendly.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src https://calendly.com https://*.calendly.com",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), geolocation=(), microphone=()',
  },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
]

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
    ],
  },
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
