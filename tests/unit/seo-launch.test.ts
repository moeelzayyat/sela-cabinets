import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { siteConfig } from '@/config/site'

const source = (...parts: string[]) =>
  readFileSync(resolve(process.cwd(), 'src', 'app', ...parts), 'utf8')

const visibleRoutes = [
  '/',
  '/services',
  '/products',
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

const metadataFiles: Record<(typeof visibleRoutes)[number], string[]> = {
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
  '/blog/kitchen-cabinet-costs-detroit': [
    'blog',
    'kitchen-cabinet-costs-detroit',
    'page.tsx',
  ],
}

describe('launch SEO surface', () => {
  it('publishes only visible launch routes in the sitemap', () => {
    const urls = sitemap().map(({ url }) => url)
    const expected = visibleRoutes.map((route) =>
      route === '/' ? siteConfig.seo.url : `${siteConfig.seo.url}${route}`
    )

    expect(urls).toEqual(expected)
    expect(urls.join('\n')).not.toMatch(/service-areas|\/locations\//)
  })

  it('does not block Next assets and disallows disabled/private surfaces', () => {
    const rules = robots().rules
    const serialized = JSON.stringify(rules)

    expect(serialized).not.toContain('/_next/')
    expect(serialized).toContain('/api/')
    expect(serialized).toContain('/admin/')
    expect(serialized).toContain('/account/')
    expect(serialized).not.toContain('/products')
  })

  it('does not apply the homepage canonical globally', () => {
    expect(source('layout.tsx')).not.toMatch(/rel=["']canonical["']/)
  })

  it('does not link to unpublished blog articles', () => {
    const blogSource = source('blog', 'page.tsx')

    expect(blogSource).not.toContain('framed-vs-frameless-cabinets-detroit')
    expect(blogSource).not.toContain('kitchen-cabinet-color-trends-2025')
  })

  it.each(visibleRoutes)('declares a self-canonical for %s', (route) => {
    const pageSource = source(...metadataFiles[route])
    const canonical = route === '/' ? '/' : route

    expect(pageSource).toContain('alternates:')
    expect(pageSource).toContain(`canonical: '${canonical}'`)
  })
})
