import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { HeroSection } from '@/components/sections/hero-section'
import { CompletedProjectsSection } from '@/components/sections/completed-projects-section'
import { ReviewsSection } from '@/components/sections/reviews-section'
import { productsCatalog } from '@/config/products-catalog'
import { serviceAreaPages } from '@/config/service-area-pages'
import { indexableRoutes } from '@/config/indexable-routes'
import { siteConfig } from '@/config/site'

const sourceRoots = ['src/app', 'src/components', 'src/config']
const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.json'])
const forbiddenBrand = ['a', 'l', 'i', 'n', 'e'].join('')

function filesUnder(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [path]
  })
}

function publicSourceFiles() {
  return sourceRoots.flatMap((root) => filesUnder(resolve(process.cwd(), root)))
    .filter((path) => textExtensions.has(extname(path)))
}

function parseJsonLd(markup: string) {
  const body = markup.match(/<script[^>]*>(.*)<\/script>/)?.[1]
  if (!body) throw new Error('JSON-LD script missing')
  return JSON.parse(body) as Record<string, unknown>
}

describe('SELA search-intent and truthfulness overhaul', () => {
  it('emits no obsolete keyword metadata or remote Unsplash dependencies', () => {
    for (const path of publicSourceFiles()) {
      const source = readFileSync(path, 'utf8')
      expect(source, relative(process.cwd(), path)).not.toMatch(/\bkeywords\s*:/)
      expect(source, relative(process.cwd(), path)).not.toContain('images.unsplash.com')
    }

    const nextConfig = readFileSync(resolve(process.cwd(), 'next.config.js'), 'utf8')
    expect(nextConfig).not.toContain('images.unsplash.com')
  })

  it('contains no prohibited manufacturer identity in public source or filenames', () => {
    for (const path of publicSourceFiles()) {
      expect(path.toLowerCase()).not.toContain(forbiddenBrand)
      expect(readFileSync(path, 'utf8').toLowerCase(), relative(process.cwd(), path))
        .not.toContain(forbiddenBrand)
    }
  })

  it('leads with cabinets, installation, and the bundle value', () => {
    const home = renderToStaticMarkup(<HeroSection />)
    expect(home).toMatch(/Kitchen Cabinets.*Professional Installation.*Metro Detroit/i)
    expect(home).toMatch(/You pick the cabinets\. We handle the rest\./i)
    expect(home).toMatch(/one point of contact/i)
    expect(home).not.toMatch(/Confusion\s*to/i)
  })

  it('uses icon components rather than broken question-mark glyphs on About', () => {
    const about = readFileSync(resolve(process.cwd(), 'src/app/about/page.tsx'), 'utf8')
    expect(about).not.toMatch(/>\s*\?\s*</)
    expect(about).toMatch(/Check/)
  })

  it('publishes service-area business schema without an address or installer person', () => {
    const schema = parseJsonLd(renderToStaticMarkup(<LocalBusinessJsonLd />))
    expect(schema['@type']).toBe('HomeAndConstructionBusiness')
    expect(schema.telephone).toBe('+1-313-468-3225')
    expect(schema.email).toBe('info@selacabinets.com')
    expect(schema.logo).toBeTruthy()
    expect(schema.image).toBeTruthy()
    expect(schema.areaServed).toHaveLength(siteConfig.serviceAreas.length)
    expect(schema).not.toHaveProperty('address')
    expect(JSON.stringify(schema)).not.toMatch(/"@type":"Person"/)
  })

  it('defines 13 unique city pages and 29 product routes in the sitemap source', () => {
    const cityNames = serviceAreaPages.map(({ name }) => name)
    expect(cityNames).toEqual([
      'Detroit', 'Dearborn', 'Livonia', 'Troy', 'Warren', 'Sterling Heights',
      'Ann Arbor', 'Farmington Hills', 'Southfield', 'Royal Oak', 'Novi',
      'Canton', 'Westland',
    ])
    expect(new Set(serviceAreaPages.map(({ introduction }) => introduction)).size).toBe(13)
    expect(new Set(serviceAreaPages.map(({ homeNotes }) => homeNotes)).size).toBe(13)

    const products = [...productsCatalog.framed, ...productsCatalog.frameless]
    expect(products).toHaveLength(29)
    for (const city of serviceAreaPages) {
      expect(indexableRoutes).toContain(`/service-areas/${city.slug}`)
    }
    for (const product of products) {
      expect(indexableRoutes).toContain(`/products/${product.id}`)
    }
  })

  it('keeps future project and review sections hidden while evidence arrays are empty', () => {
    expect(renderToStaticMarkup(<CompletedProjectsSection />)).toBe('')
    expect(renderToStaticMarkup(<ReviewsSection />)).toBe('')
  })

  it('retains explicit owner-controlled placeholders for unknown facts', () => {
    expect(siteConfig.owner.name).toBe('[OWNER NAME]')
    expect(siteConfig.owner.shortBio).toBe('[SHORT OWNER BIO]')
    expect(siteConfig.installer.yearsOfExperience).toBe('[YEARS OF EXPERIENCE]')
    expect(siteConfig.pricing.installedRange).toBe('[PRICE RANGE]')
    expect(siteConfig.businessFacts.hours).toBe('[HOURS]')
    expect(siteConfig.businessFacts.gscVerification).toBe('[GSC VERIFICATION CODE]')
  })
})
