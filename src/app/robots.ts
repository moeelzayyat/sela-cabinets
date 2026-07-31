import { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site'

function isCanonicalProductionOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!configuredUrl) return false

  try {
    return new URL(configuredUrl).origin === new URL(siteConfig.seo.url).origin
  } catch {
    return false
  }
}

export default function robots(): MetadataRoute.Robots {
  if (!isCanonicalProductionOrigin()) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/account/', '/locations/', '/service-areas/'],
      },
    ],
    sitemap: `${siteConfig.seo.url}/sitemap.xml`,
  }
}
