import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { allCabinetProducts } from '@/config/products-catalog'
import { indexableRoutes } from '@/config/indexable-routes'
import { serviceAreaPages } from '@/config/service-area-pages'
import { siteConfig } from '@/config/site'

const source = (...parts: string[]) =>
  readFileSync(resolve(process.cwd(), 'src', 'app', ...parts), 'utf8')

const staticMetadataFiles: Record<string, string[]> = {
  '/': ['page.tsx'],
  '/about': ['about', 'page.tsx'],
  '/services': ['services', 'page.tsx'],
  '/services/kitchen-cabinet-installation-detroit': ['services', 'kitchen-cabinet-installation-detroit', 'page.tsx'],
  '/services/kitchen-cabinet-supply-detroit': ['services', 'kitchen-cabinet-supply-detroit', 'page.tsx'],
  '/services/in-home-cabinet-measurement': ['services', 'in-home-cabinet-measurement', 'page.tsx'],
  '/products': ['products', 'page.tsx'],
  '/gallery': ['gallery', 'page.tsx'],
  '/pricing': ['pricing', 'page.tsx'],
  '/estimate': ['estimate', 'layout.tsx'],
  '/book': ['book', 'page.tsx'],
  '/faqs': ['faqs', 'page.tsx'],
  '/contact': ['contact', 'page.tsx'],
  '/service-areas/metro-detroit': ['service-areas', 'metro-detroit', 'page.tsx'],
  '/service-areas/detroit': ['service-areas', 'detroit', 'page.tsx'],
  '/blog': ['blog', 'page.tsx'],
  '/blog/kitchen-cabinet-planning-detroit': ['blog', 'kitchen-cabinet-planning-detroit', 'page.tsx'],
}

function literal(sourceText: string, field: 'title' | 'description') {
  return sourceText.match(new RegExp(`const ${field} = '([^']+)'`))?.[1]
    ?? sourceText.match(new RegExp(`${field}:\\s*'([^']+)'`))?.[1]
}

function metadataForRoute(route: string) {
  if (route === '/') {
    return {
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.defaultDescription,
    }
  }

  const product = allCabinetProducts.find((item) => route === `/products/${item.id}`)
  if (product) {
    return {
      title: `${product.name} Kitchen Cabinets${siteConfig.seo.titleTemplate.replace('%s', '')}`,
      description: `${product.name} ${product.construction} kitchen cabinets for Metro Detroit homes. Review construction, design character, pairings, and request an estimate.`,
    }
  }

  const area = serviceAreaPages.find((item) => route === `/service-areas/${item.slug}`)
  if (area && area.slug !== 'detroit') {
    return {
      title: `Kitchen Cabinets ${area.name} MI${siteConfig.seo.titleTemplate.replace('%s', '')}`,
      description: `Quality kitchen cabinets and professional installation in ${area.name}, Michigan, with in-home measurement, written scope, and one direct contact.`,
    }
  }

  const parts = staticMetadataFiles[route]
  expect(parts, `metadata source for ${route}`).toBeTruthy()
  const pageSource = source(...parts)
  const title = literal(pageSource, 'title')
  const description = route === '/contact'
    ? `Contact ${siteConfig.name} for kitchen cabinets and professional installation in Metro Detroit. Call ${siteConfig.phone} or request an estimate online.`
    : literal(pageSource, 'description')

  expect(title, `literal metadata title for ${route}`).toBeTruthy()
  expect(description, `literal metadata description for ${route}`).toBeTruthy()

  return {
    title: `${title}${siteConfig.seo.titleTemplate.replace('%s', '')}`,
    description: description!,
  }
}

function metadataSourceForRoute(route: string) {
  if (route.startsWith('/products/')) return source('products', '[slug]', 'page.tsx')
  if (route.startsWith('/service-areas/') && route !== '/service-areas/metro-detroit' && route !== '/service-areas/detroit') {
    return source('service-areas', '[city]', 'page.tsx')
  }
  return source(...staticMetadataFiles[route])
}

describe('launch SEO surface', () => {
  it('publishes every configured public route in the sitemap', () => {
    const urls = sitemap().map(({ url }) => url)
    const expected = indexableRoutes.map((route) =>
      route === '/' ? siteConfig.seo.url : `${siteConfig.seo.url}${route}`
    )

    expect(urls).toEqual(expected)
    expect(urls).toContain(`${siteConfig.seo.url}/service-areas/metro-detroit`)
    expect(urls.join('\n')).not.toMatch(/\/locations\//)
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

  it('keeps resolved production titles unique and at most 60 characters', () => {
    const resolvedTitles = indexableRoutes.map((route) => metadataForRoute(route).title)

    expect(new Set(resolvedTitles).size).toBe(resolvedTitles.length)
    for (const title of resolvedTitles) {
      expect(title.length, title).toBeGreaterThanOrEqual(30)
      expect(title.length, title).toBeLessThanOrEqual(60)
    }
  })

  it('keeps production descriptions unique and between 70 and 155 characters', () => {
    const descriptions = indexableRoutes.map((route) => metadataForRoute(route).description)

    expect(new Set(descriptions).size).toBe(descriptions.length)
    for (const description of descriptions) {
      expect(description.length, description).toBeGreaterThanOrEqual(70)
      expect(description.length, description).toBeLessThanOrEqual(155)
    }
  })

  it('publishes one stable construction-business entity and references it from services', () => {
    const homeSource = source('page.tsx')
    const layoutSource = source('layout.tsx')
    const schemaSource = readFileSync(
      resolve(process.cwd(), 'src', 'components', 'seo', 'json-ld.tsx'),
      'utf8'
    )

    expect(homeSource).not.toContain('<LocalBusinessJsonLd />')
    expect(layoutSource.match(/<LocalBusinessJsonLd \/>/g)).toHaveLength(1)
    expect(schemaSource).toContain("'@type': 'HomeAndConstructionBusiness'")
    expect(schemaSource).toContain("const businessId = `${siteConfig.seo.url}/#business`")
    expect(schemaSource).toContain("'@id': businessId")
    expect(schemaSource).toContain("provider: { '@id': businessId }")
  })

  it('publishes a 1200 by 630 default Open Graph image and key-page overrides', () => {
    const imagePath = resolve(process.cwd(), 'public', 'images', 'seo', 'sela-cabinets-og.png')
    const socialMetadataSource = readFileSync(
      resolve(process.cwd(), 'src', 'components', 'seo', 'page-social-metadata.ts'),
      'utf8'
    )

    expect(existsSync(imagePath)).toBe(true)
    const png = readFileSync(imagePath)
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(png.readUInt32BE(16)).toBe(1200)
    expect(png.readUInt32BE(20)).toBe(630)
    expect(socialMetadataSource).toContain("image = '/images/seo/sela-cabinets-og.png'")
    expect(socialMetadataSource).toContain('imageWidth = 1200')
    expect(socialMetadataSource).toContain('imageHeight = 630')

    for (const filename of ['home-og.jpg', 'products-og.jpg', 'installation-og.jpg', 'about-og.jpg']) {
      expect(existsSync(resolve(process.cwd(), 'public', 'images', 'seo', filename)), filename).toBe(true)
    }
  })

  it('redirects the misleading cost URL to a schema-backed planning guide', () => {
    const articleSource = source('blog', 'kitchen-cabinet-planning-detroit', 'page.tsx')
    const configSource = readFileSync(resolve(process.cwd(), 'next.config.js'), 'utf8')

    expect(configSource).toContain("source: '/blog/kitchen-cabinet-costs-detroit'")
    expect(configSource).toContain("destination: '/blog/kitchen-cabinet-planning-detroit'")
    expect(configSource).toContain('permanent: true')
    expect(articleSource).toContain('<ArticleSchema')
    expect(articleSource).toContain('<BreadcrumbSchema')
    expect(articleSource).toContain('aria-label="Breadcrumb"')
    expect(articleSource).not.toMatch(/price range|pricing guide/i)
  })

  it('does not publish an unverified booking duration', () => {
    expect(source('book', 'page.tsx')).not.toMatch(/\b15(?:-|\s)minute|\b15 minutes/i)
  })

  it('does not apply the homepage canonical globally', () => {
    expect(source('layout.tsx')).not.toMatch(/rel=["']canonical["']/)
  })

  it('does not link to unpublished blog drafts', () => {
    const blogSource = source('blog', 'page.tsx')
    expect(blogSource).not.toContain('framed-vs-frameless-cabinets-detroit')
    expect(blogSource).not.toContain('kitchen-cabinet-color-trends-2025')
  })

  it.each(indexableRoutes)('declares a self-canonical for %s', (route) => {
    const pageSource = metadataSourceForRoute(route)

    expect(pageSource).toContain('alternates:')
    if (route === '/') {
      expect(pageSource).toContain("canonical: '/'")
    } else if (route.startsWith('/products/')) {
      expect(pageSource).toContain('const path = `/products/${product.id}`')
      expect(pageSource).toContain('alternates: { canonical: path }')
    } else if (route.startsWith('/service-areas/') && route !== '/service-areas/metro-detroit' && route !== '/service-areas/detroit') {
      expect(pageSource).toContain('const path = `/service-areas/${area.slug}`')
      expect(pageSource).toContain('alternates: { canonical: path }')
    } else if (pageSource.includes('alternates: { canonical: path }')) {
      expect(pageSource).toContain(`const path = '${route}'`)
    } else {
      expect(pageSource).toContain(`canonical: '${route}'`)
    }
  })
})
