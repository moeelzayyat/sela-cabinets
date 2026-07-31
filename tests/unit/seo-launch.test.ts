import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { indexableRoutes } from '@/config/indexable-routes'
import { siteConfig } from '@/config/site'

const source = (...parts: string[]) =>
  readFileSync(resolve(process.cwd(), 'src', 'app', ...parts), 'utf8')

const metadataFiles: Record<(typeof indexableRoutes)[number], string[]> = {
  '/': ['page.tsx'],
  '/services': ['services', 'page.tsx'],
  '/products': ['products', 'page.tsx'],
  '/pricing': ['pricing', 'page.tsx'],
  '/gallery': ['gallery', 'page.tsx'],
  '/about': ['about', 'page.tsx'],
  '/faqs': ['faqs', 'page.tsx'],
  '/contact': ['contact', 'page.tsx'],
  '/book': ['book', 'page.tsx'],
  '/estimate': ['estimate', 'layout.tsx'],
  '/blog': ['blog', 'page.tsx'],
  '/blog/kitchen-cabinet-planning-detroit': [
    'blog',
    'kitchen-cabinet-planning-detroit',
    'page.tsx',
  ],
}

describe('launch SEO surface', () => {
  it('publishes only visible launch routes in the sitemap', () => {
    const urls = sitemap().map(({ url }) => url)
    const expected = indexableRoutes.map((route) =>
      route === '/' ? siteConfig.seo.url : `${siteConfig.seo.url}${route}`
    )

    expect(urls).toEqual(expected)
    expect(urls.join('\n')).not.toMatch(/service-areas|\/locations\//)
  })

  it('does not block Next assets and disallows disabled/private surfaces', () => {
    const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL
    process.env.NEXT_PUBLIC_APP_URL = siteConfig.seo.url
    const serialized = JSON.stringify(robots().rules)
    if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL
    else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl

    expect(serialized).not.toContain('/_next/')
    expect(serialized).toContain('/api/')
    expect(serialized).toContain('/admin/')
    expect(serialized).toContain('/account/')
    expect(serialized).not.toContain('/products')
  })

  it('keeps every resolved production title unique and between 45 and 65 characters', () => {
    const suffix = siteConfig.seo.titleTemplate.replace('%s', '')
    const resolvedTitles = indexableRoutes.map((route) => {
      if (route === '/') {
        expect(source('page.tsx')).toContain('title: { absolute: siteConfig.seo.defaultTitle }')
        return siteConfig.seo.defaultTitle
      }

      const pageSource = source(...metadataFiles[route])
      const title = pageSource.match(/title:\s*'([^']+)'/)?.[1]
      expect(title, `literal metadata title for ${route}`).toBeTruthy()
      expect(title, `route title should not duplicate the global brand for ${route}`).not.toContain('SELA Cabinets')
      return `${title}${suffix}`
    })

    expect(new Set(resolvedTitles).size).toBe(resolvedTitles.length)
    for (const title of resolvedTitles) {
      expect(title.length, title).toBeGreaterThanOrEqual(45)
      expect(title.length, title).toBeLessThanOrEqual(65)
    }
  })

  it('keeps literal production descriptions unique and between 70 and 155 characters', () => {
    const descriptions = indexableRoutes.flatMap((route) => {
      if (route === '/') return [siteConfig.seo.defaultDescription]
      const pageSource = source(...metadataFiles[route])
      const description = pageSource.match(/description:\s*'([^']+)'/)?.[1]
      return description ? [description] : []
    })

    expect(new Set(descriptions).size).toBe(descriptions.length)
    for (const description of descriptions) {
      expect(description.length, description).toBeGreaterThanOrEqual(70)
      expect(description.length, description).toBeLessThanOrEqual(155)
    }
  })

  it('publishes one stable LocalBusiness entity and references it from services', () => {
    const homeSource = source('page.tsx')
    const layoutSource = source('layout.tsx')
    const schemaSource = readFileSync(
      resolve(process.cwd(), 'src', 'components', 'seo', 'json-ld.tsx'),
      'utf8'
    )

    expect(homeSource).not.toContain('<LocalBusinessJsonLd />')
    expect(layoutSource.match(/<LocalBusinessJsonLd \/>/g)).toHaveLength(1)
    expect(schemaSource).toContain("const businessId = `${siteConfig.seo.url}/#business`")
    expect(schemaSource).toContain("'@id': businessId")
    expect(schemaSource).toContain("provider: { '@id': businessId }")
  })

  it('publishes a 1200 by 630 branded Open Graph image', () => {
    const imagePath = resolve(
      process.cwd(),
      'public',
      'images',
      'seo',
      'sela-cabinets-og.png'
    )
    const socialMetadataSource = readFileSync(
      resolve(process.cwd(), 'src', 'components', 'seo', 'page-social-metadata.ts'),
      'utf8'
    )

    expect(existsSync(imagePath)).toBe(true)
    const png = readFileSync(imagePath)
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
    expect(socialMetadataSource).toContain("url: '/images/seo/sela-cabinets-og.png'")
    expect(socialMetadataSource).toContain('width: 1200')
    expect(socialMetadataSource).toContain('height: 630')
  })

  it('redirects the misleading cost URL to a schema-backed planning guide', () => {
    const articleSource = source(
      'blog',
      'kitchen-cabinet-planning-detroit',
      'page.tsx'
    )
    const configSource = readFileSync(resolve(process.cwd(), 'next.config.js'), 'utf8')

    expect(configSource).toContain("source: '/blog/kitchen-cabinet-costs-detroit'")
    expect(configSource).toContain("destination: '/blog/kitchen-cabinet-planning-detroit'")
    expect(configSource).toContain('permanent: true')
    expect(articleSource).toContain('<ArticleSchema')
    expect(articleSource).toContain('<BreadcrumbSchema')
    expect(articleSource).toContain('aria-label="Breadcrumb"')
    expect(articleSource).toContain("canonical: '/blog/kitchen-cabinet-planning-detroit'")
    expect(articleSource).not.toMatch(/cost|price range|pricing guide/i)
  })

  it('does not publish an unverified booking duration', () => {
    const bookSource = source('book', 'page.tsx')

    expect(bookSource).not.toMatch(/\b15(?:-|\s)minute|\b15 minutes/i)
  })

  it('does not apply the homepage canonical globally', () => {
    expect(source('layout.tsx')).not.toMatch(/rel=["']canonical["']/)
  })

  it('does not link to unpublished blog articles', () => {
    const blogSource = source('blog', 'page.tsx')

    expect(blogSource).not.toContain('framed-vs-frameless-cabinets-detroit')
    expect(blogSource).not.toContain('kitchen-cabinet-color-trends-2025')
  })

  it.each(indexableRoutes)('declares a self-canonical for %s', (route) => {
    const pageSource = source(...metadataFiles[route])
    const canonical = route === '/' ? '/' : route

    expect(pageSource).toContain('alternates:')
    expect(pageSource).toContain(`canonical: '${canonical}'`)
  })
})
