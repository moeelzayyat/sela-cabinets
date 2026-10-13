import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import HomePage from '@/app/page'
import PricingPage from '@/app/pricing/page'
import InHomeCabinetMeasurementPage from '@/app/services/in-home-cabinet-measurement/page'
import KitchenCabinetInstallationDetroitPage from '@/app/services/kitchen-cabinet-installation-detroit/page'
import KitchenCabinetSupplyDetroitPage from '@/app/services/kitchen-cabinet-supply-detroit/page'
import { CityServiceAreaPage } from '@/components/service-area/city-service-area-page'
import { LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { allCabinetProducts } from '@/config/products-catalog'
import { serviceAreaPages } from '@/config/service-area-pages'
import { siteConfig } from '@/config/site'

type ExpandedArea = (typeof serviceAreaPages)[number] & {
  metaDescription: string
  contentSections: readonly { heading: string; paragraphs: readonly string[] }[]
}

type ExpandedProduct = (typeof allCabinetProducts)[number] & {
  styleNotes: readonly string[]
}

const cityPages = serviceAreaPages as unknown as readonly ExpandedArea[]
const products = allCabinetProducts as unknown as readonly ExpandedProduct[]

function documentFor(markup: string) {
  const node = document.createElement('div')
  node.innerHTML = markup
  return node
}

function words(value: string) {
  return value.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? []
}

function textOf(Page: () => React.ReactNode) {
  return documentFor(renderToStaticMarkup(<>{Page()}</>)).textContent ?? ''
}

function jsonLd(markup: string) {
  return [...documentFor(markup).querySelectorAll('script[type="application/ld+json"]')]
    .map((node) => JSON.parse(node.textContent ?? 'null'))
}

describe('seven-item SEO staging candidate', () => {
  it('uses the Google verification file and canonical homepage slash everywhere', () => {
    const layout = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf8')
    const verification = readFileSync(
      resolve(process.cwd(), 'public/google5311959f90a181fd.html'),
      'utf8',
    )
    expect(layout).not.toContain('[GSC VERIFICATION CODE]')
    expect(verification).toBe('google-site-verification: google5311959f90a181fd.html')
    const homeMarkup = documentFor(renderToStaticMarkup(<HomePage />))
    expect(homeMarkup.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://selacabinets.com/')
    expect(homeMarkup.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://selacabinets.com/')
    expect(homeMarkup.querySelector('meta[name="twitter:url"]')?.getAttribute('content')).toBe('https://selacabinets.com/')

    const schema = jsonLd(renderToStaticMarkup(<LocalBusinessJsonLd />))[0]
    expect(schema.url).toBe('https://selacabinets.com/')
    expect(schema['@id']).toBe('https://selacabinets.com/#business')
  })

  it('contains Redford, Dearborn Heights, and Taylor in the exact served-city set', () => {
    expect(cityPages.map(({ slug }) => slug)).toEqual(expect.arrayContaining([
      'redford',
      'dearborn-heights',
      'taylor',
    ]))
    expect(siteConfig.serviceAreas).toEqual(cityPages.map(({ name }) => name))
  })

  it.each(cityPages)('$name has 500+ rendered words and substantial unique city sections', (area) => {
    const markup = renderToStaticMarkup(<CityServiceAreaPage area={area} />)
    const pageText = documentFor(markup).textContent ?? ''
    expect(words(pageText).length, area.slug).toBeGreaterThanOrEqual(500)
    expect(area.contentSections.length, area.slug).toBeGreaterThanOrEqual(4)
    expect(new Set(area.contentSections.map(({ heading }) => heading)).size).toBe(area.contentSections.length)
    expect(area.contentSections.flatMap(({ paragraphs }) => paragraphs).every((paragraph) => words(paragraph).length >= 45)).toBe(true)
  })

  it('keeps city descriptions unique, conversion-focused, and within snippet length', () => {
    const descriptions = cityPages.map(({ metaDescription }) => metaDescription)
    expect(new Set(descriptions).size).toBe(cityPages.length)
    for (const area of cityPages) {
      expect(area.metaDescription).toContain(area.name)
      expect(area.metaDescription.length).toBeLessThanOrEqual(155)
      expect(area.metaDescription).toMatch(/book|call|request|schedule|start|contact|plan|get/i)
    }
  })

  it.each([
    ['supply', KitchenCabinetSupplyDetroitPage],
    ['installation', KitchenCabinetInstallationDetroitPage],
    ['measurement', InHomeCabinetMeasurementPage],
  ] as const)('gives the %s page 700+ words, Service schema, and 4-6 visible FAQs', (_label, Page) => {
    const markup = renderToStaticMarkup(<Page />)
    const page = documentFor(markup)
    expect(words(page.textContent ?? '').length).toBeGreaterThanOrEqual(700)
    const faqs = page.querySelectorAll('[data-service-faq]')
    expect(faqs.length).toBeGreaterThanOrEqual(4)
    expect(faqs.length).toBeLessThanOrEqual(6)
    const schemas = jsonLd(markup)
    expect(schemas.some((schema) => schema['@type'] === 'Service')).toBe(true)
    expect(schemas.some((schema) => schema['@type'] === 'FAQPage')).toBe(true)
  })

  it('shows the exact installation price placeholder on home, pricing, and installation', () => {
    const expected = 'Most 10x10 kitchens, installed, start at [PRICE].'
    expect(textOf(HomePage)).toContain(expected)
    expect(textOf(PricingPage)).toContain(expected)
    expect(textOf(KitchenCabinetInstallationDetroitPage)).toContain(expected)
  })

  it('gives every cabinet style three useful and distinct style notes', () => {
    const allNotes = products.flatMap(({ styleNotes }) => styleNotes)
    for (const product of products) {
      expect(product.styleNotes).toHaveLength(3)
      expect(product.styleNotes.every((note) => words(note).length >= 10)).toBe(true)
    }
    expect(new Set(allNotes).size).toBe(allNotes.length)
  })

  it('lazy-loads below-fold home images and prioritizes one responsive hero image', () => {
    const page = documentFor(renderToStaticMarkup(<HomePage />))
    const inspirationImages = [...page.querySelectorAll('section img')]
      .filter((image) => image.getAttribute('alt')?.match(/cabinet|kitchen/i))
      .slice(1)
    expect(inspirationImages.length).toBeGreaterThan(0)
    expect(inspirationImages.every((image) => image.getAttribute('loading') === 'lazy')).toBe(true)
    const hero = page.querySelector('img[fetchpriority="high"]')
    expect(hero?.getAttribute('srcset')).toMatch(/640w.*960w.*1600w/)
    expect(hero?.getAttribute('sizes')).toBeTruthy()
    expect(page.querySelector('link[rel="preload"][imagesrcset]')).not.toBeNull()
  })

  it('uses Montserrat instead of Playfair and preserves 44px link targets in the footer', () => {
    const layout = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf8')
    const tailwind = readFileSync(resolve(process.cwd(), 'tailwind.config.ts'), 'utf8')
    expect(layout).toContain('Montserrat')
    expect(layout).not.toContain('Playfair_Display')
    expect(tailwind).toContain('--font-montserrat')
    const footer = readFileSync(resolve(process.cwd(), 'src/components/layout/footer.tsx'), 'utf8')
    expect(footer).toContain('min-h-11')
  })

  it('keeps truthful business schema, exact city coverage, valid logo PNG, and no review markup', () => {
    const schema = jsonLd(renderToStaticMarkup(<LocalBusinessJsonLd />))[0]
    expect(schema.priceRange).toBe('$$')
    expect(schema.areaServed.map(({ name }: { name: string }) => name)).toEqual(cityPages.map(({ name }) => name))
    expect(schema).not.toHaveProperty('sameAs')
    expect(schema).not.toHaveProperty('review')
    expect(schema).not.toHaveProperty('aggregateRating')
    expect(schema.openingHoursSpecification).toEqual([
      { '@type': 'OpeningHoursSpecification', description: '[HOURS]' },
    ])
    expect(schema.logo).toMatch(/\.png$/)
    const logoPath = resolve(process.cwd(), 'public', new URL(schema.logo).pathname.slice(1))
    expect(existsSync(logoPath)).toBe(true)
    const png = readFileSync(logoPath)
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(png.readUInt32BE(16)).toBeGreaterThanOrEqual(112)
    expect(png.readUInt32BE(20)).toBeGreaterThanOrEqual(112)
  })

  it('configures permanent edge HTTPS redirects and canonical homepage URLs', () => {
    const compose = readFileSync(resolve(process.cwd(), 'docker-compose.yaml'), 'utf8')
    expect(compose).toContain('redirect-to-https.redirectscheme.permanent=true')
  })

  it('archives every old homepage, service, and city meta description for later CTR comparison', () => {
    const archivePath = resolve(process.cwd(), 'docs/meta-descriptions-before.md')
    expect(existsSync(archivePath)).toBe(true)
    const archive = readFileSync(archivePath, 'utf8')
    for (const route of [
      '/',
      '/services/kitchen-cabinet-supply-detroit',
      '/services/kitchen-cabinet-installation-detroit',
      '/services/in-home-cabinet-measurement',
      ...cityPages.map(({ slug }) => `/service-areas/${slug}`),
    ]) {
      expect(archive, route).toContain(`| \`${route}\` |`)
    }
  })
})