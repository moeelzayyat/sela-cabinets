import { MetadataRoute } from 'next'

import { indexableRoutes } from '@/config/indexable-routes'
import { siteConfig } from '@/config/site'

// Routes with page-specific content changes use the release date. Public pages that
// only inherit shared shell changes retain their last meaningful Git content date.
const seoCandidateModified = new Date('2026-10-12T00:00:00.000Z')
const preservedContentDates = new Map<string, Date>([
  ['/contact', new Date('2026-10-06T00:00:00.000Z')],
  ['/book', new Date('2026-10-06T00:00:00.000Z')],
  ['/estimate', new Date('2026-10-06T00:00:00.000Z')],
  ['/faqs', new Date('2026-10-06T00:00:00.000Z')],
  ['/gallery', new Date('2026-10-06T00:00:00.000Z')],
  ['/blog', new Date('2026-10-06T00:00:00.000Z')],
  ['/blog/kitchen-cabinet-planning-detroit', new Date('2026-10-06T00:00:00.000Z')],
])

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.map((route, index) => ({
    url: route === '/' ? siteConfig.seo.homepageUrl : `${siteConfig.seo.url}${route}`,
    lastModified: preservedContentDates.get(route) ?? seoCandidateModified,
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.8,
  }))
}
