import { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site'

const launchRoutes = [
  '/',
  '/services',
  '/pricing',
  '/gallery',
  '/about',
  '/faqs',
  '/contact',
  '/book',
  '/estimate',
  '/blog',
  '/blog/kitchen-cabinet-costs-detroit',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return launchRoutes.map((route, index) => ({
    url: route === '/' ? siteConfig.seo.url : `${siteConfig.seo.url}${route}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.8,
  }))
}
