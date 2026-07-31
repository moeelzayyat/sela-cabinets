import { MetadataRoute } from 'next'

import { indexableRoutes } from '@/config/indexable-routes'
import { siteConfig } from '@/config/site'

const planningGuidePath = '/blog/kitchen-cabinet-planning-detroit'
const planningGuideModified = new Date('2026-07-30T00:00:00.000Z')

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.map((route, index) => ({
    url: route === '/' ? siteConfig.seo.url : `${siteConfig.seo.url}${route}`,
    ...(route === planningGuidePath ? { lastModified: planningGuideModified } : {}),
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.8,
  }))
}
