import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import sitemap from '@/app/sitemap'
import { indexableRoutes } from '@/config/indexable-routes'
import { siteConfig } from '@/config/site'

const growthRoutes = [
  '/services/kitchen-cabinet-installation-detroit',
  '/services/kitchen-cabinet-supply-detroit',
  '/services/in-home-cabinet-measurement',
  '/service-areas/metro-detroit',
] as const

const pagePath = (route: (typeof growthRoutes)[number]) =>
  resolve(process.cwd(), 'src', 'app', ...route.slice(1).split('/'), 'page.tsx')

describe('organic SEO growth surface', () => {
  it('publishes focused commercial-intent and service-area routes', () => {
    const sitemapUrls = sitemap().map(({ url }) => url)

    for (const route of growthRoutes) {
      expect(indexableRoutes).toContain(route)
      expect(sitemapUrls).toContain(`${siteConfig.seo.url}${route}`)
      expect(existsSync(pagePath(route)), route).toBe(true)
    }
  })

  it('gives every growth route unique metadata, a self-canonical, and substantial copy', () => {
    const titles = new Set<string>()
    const descriptions = new Set<string>()

    for (const route of growthRoutes) {
      const source = readFileSync(pagePath(route), 'utf8')
      const title = source.match(/title:\s*'([^']+)'/)?.[1]
      const description = source.match(/description:\s*'([^']+)'/)?.[1]
      const wordCount = source
        .replace(/<[^>]+>/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length

      expect(title, `${route} title`).toBeTruthy()
      expect(description, `${route} description`).toBeTruthy()
      expect(titles.has(title!), `${route} duplicate title`).toBe(false)
      expect(descriptions.has(description!), `${route} duplicate description`).toBe(false)
      expect(source).toContain(`canonical: '${route}'`)
      expect(source).toContain('createPageSocialMetadata')
      expect(wordCount, `${route} source copy depth`).toBeGreaterThan(250)

      titles.add(title!)
      descriptions.add(description!)
    }
  })

  it('links discovery pages from the global footer', () => {
    const footer = readFileSync(
      resolve(process.cwd(), 'src', 'components', 'layout', 'footer.tsx'),
      'utf8'
    )

    expect(footer).toContain('href="/blog"')
    expect(footer).toContain('href="/service-areas/metro-detroit"')
    for (const route of growthRoutes.slice(0, 3)) {
      expect(footer).toContain(`href="${route}"`)
    }
  })

  it('permanently consolidates the www host into the canonical apex host', () => {
    const config = readFileSync(resolve(process.cwd(), 'next.config.js'), 'utf8')

    expect(config).toContain("type: 'host'")
    expect(config).toContain("value: 'www.selacabinets.com'")
    expect(config).toContain("destination: 'https://selacabinets.com/:path*'")
    expect(config).toContain('permanent: true')
  })
})
