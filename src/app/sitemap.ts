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
    '/locations/west-bloomfield',
    '/locations/birmingham',
    '/locations/royal-oak',
    '/locations/farmington-hills',
    '/locations/rochester-hills',
    '/locations/novi',
    '/locations/canton',
    '/locations/bloomfield-hills',
    '/locations/shelby-township',
    '/locations/grosse-pointe',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}

