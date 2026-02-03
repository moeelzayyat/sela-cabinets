import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.seo.url

  const routes = [
    '',
    '/services',
    '/products',
    '/gallery',
    '/about',
    '/faqs',
    '/contact',
    '/book',
    '/estimate',
    '/blog',
    '/blog/kitchen-cabinet-costs-detroit',
    '/locations/dearborn',
    '/locations/livonia',
    '/locations/troy',
    '/locations/warren',
    '/locations/sterling-heights',
    '/locations/ann-arbor',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}

