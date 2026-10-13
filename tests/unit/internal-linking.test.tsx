import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import AboutPage from '@/app/about/page'
import CabinetStylePage from '@/app/products/[slug]/page'
import InHomeCabinetMeasurementPage from '@/app/services/in-home-cabinet-measurement/page'
import KitchenCabinetInstallationDetroitPage from '@/app/services/kitchen-cabinet-installation-detroit/page'
import KitchenCabinetSupplyDetroitPage from '@/app/services/kitchen-cabinet-supply-detroit/page'
import ServicesPage from '@/app/services/page'
import { Footer } from '@/components/layout/footer'
import { CityServiceAreaPage } from '@/components/service-area/city-service-area-page'
import { ServicesPreview } from '@/components/sections/services-preview'
import { allCabinetProducts } from '@/config/products-catalog'
import { dedicatedServices } from '@/config/internal-links'
import { serviceAreaPages } from '@/config/service-area-pages'
import { siteConfig } from '@/config/site'

const dedicatedServiceHrefs = [
  '/services/kitchen-cabinet-supply-detroit',
  '/services/kitchen-cabinet-installation-detroit',
  '/services/in-home-cabinet-measurement',
] as const

const popularStyleHrefs = allCabinetProducts
  .slice(0, 6)
  .map((product) => `/products/${product.id}`)

function documentFor(markup: string) {
  const container = document.createElement('div')
  container.innerHTML = markup
  return container
}

function hrefsIn(markup: string) {
  return [...documentFor(markup).querySelectorAll('a[href]')]
    .map((anchor) => anchor.getAttribute('href'))
    .filter((href): href is string => Boolean(href))
}

function expectPlainAnchors(markup: string) {
  const page = documentFor(markup)
  expect(page.querySelectorAll('[onclick]').length).toBe(0)
  for (const link of page.querySelectorAll('a')) {
    expect(link.hasAttribute('href')).toBe(true)
  }
}

describe('SELA server-rendered internal linking', () => {
  it('links homepage service cards to dedicated routes instead of fragments', () => {
    const markup = renderToStaticMarkup(<ServicesPreview />)
    const page = documentFor(markup)
    const hrefs = hrefsIn(markup)

    for (const href of dedicatedServiceHrefs) expect(hrefs).toContain(href)
    for (const service of dedicatedServices) {
      const card = [...page.querySelectorAll(`a[href="${service.href}"]`)]
        .find((anchor) => anchor.querySelector('h3')?.textContent === service.title)
      expect(card, `${service.title} homepage card`).toBeDefined()
    }
    expect(hrefs.some((href) => href.startsWith('/services#'))).toBe(false)
    expect(hrefs).toContain('/about')
    expect(hrefs).toContain('/contact')
    expectPlainAnchors(markup)
  })

  it('links service titles to dedicated pages and keeps booking secondary', () => {
    const page = documentFor(renderToStaticMarkup(<ServicesPage />))

    for (const service of dedicatedServices) {
      const titleLink = [...page.querySelectorAll(`h2 a[href="${service.href}"]`)]
        .find((anchor) => anchor.textContent?.trim() === service.title)
      expect(titleLink, `${service.title} title link`).toBeDefined()
    }

    const detailLinks = [...page.querySelectorAll('a')]
      .filter((anchor) => anchor.textContent?.match(/View Service Details/i))
    expect(detailLinks).toHaveLength(dedicatedServices.length)
    expect(detailLinks.map((anchor) => anchor.getAttribute('href'))).toEqual(
      dedicatedServices.map((service) => service.href),
    )
    expectPlainAnchors(page.innerHTML)
  })

  it('keeps About city names as real service-area anchors and contains no broken question glyph', () => {
    const markup = renderToStaticMarkup(<AboutPage />)
    const page = documentFor(markup)

    for (const area of serviceAreaPages) {
      expect(page.querySelector(`a[href="/service-areas/${area.slug}"]`)?.textContent).toContain(area.name)
    }
    expect(page.textContent).not.toMatch(/\?\s*\?/)
    expectPlainAnchors(markup)
  })

  it.each([
    ['supply', KitchenCabinetSupplyDetroitPage],
    ['installation', KitchenCabinetInstallationDetroitPage],
    ['measurement', InHomeCabinetMeasurementPage],
  ] as const)('adds popular styles and areas served to the %s page', (_name, Page) => {
    const markup = renderToStaticMarkup(<Page />)
    const page = documentFor(markup)
    const hrefs = hrefsIn(markup)
    const styleLinks = hrefs.filter((href) => href.startsWith('/products/'))

    expect(new Set(styleLinks).size).toBeGreaterThanOrEqual(4)
    expect(new Set(styleLinks).size).toBeLessThanOrEqual(6)
    expect(page.textContent).toMatch(/Areas we serve/i)
    for (const area of serviceAreaPages) {
      expect(hrefs).toContain(`/service-areas/${area.slug}`)
    }
    expectPlainAnchors(markup)
  })

  it.each(serviceAreaPages)('links $name to styles, every service, and contact', (area) => {
    const markup = renderToStaticMarkup(<CityServiceAreaPage area={area} />)
    const hrefs = hrefsIn(markup)
    const styleHrefs = hrefs.filter((href) => href.startsWith('/products/'))

    expect(new Set(styleHrefs)).toEqual(new Set(popularStyleHrefs))
    expect(hrefs).toContain('/services/kitchen-cabinet-supply-detroit')
    expect(hrefs).toContain('/services/kitchen-cabinet-installation-detroit')
    expect(hrefs).toContain('/services/in-home-cabinet-measurement')
    expect(hrefs).toContain('/contact')
    expectPlainAnchors(markup)
  })

  it.each(allCabinetProducts)('links $name to installation and measurement services', async (product) => {
    const page = await CabinetStylePage({ params: Promise.resolve({ slug: product.id }) })
    const markup = renderToStaticMarkup(page)
    const hrefs = hrefsIn(markup)

    expect(hrefs).toContain('/services/kitchen-cabinet-installation-detroit')
    expect(hrefs).toContain('/services/in-home-cabinet-measurement')
    const relatedStyleLinks = new Set(
      hrefs.filter((href) => href.startsWith('/products/') && href !== `/products/${product.id}`),
    )
    expect(relatedStyleLinks.size).toBeGreaterThanOrEqual(2)
    expect(relatedStyleLinks.size).toBeLessThanOrEqual(3)
    expectPlainAnchors(markup)
  })

  it('renders the footer email as a mailto anchor', () => {
    const markup = renderToStaticMarkup(<Footer />)
    const page = documentFor(markup)
    expect(page.querySelector(`a[href="mailto:${siteConfig.email}"]`)?.textContent).toContain(siteConfig.email)
    expectPlainAnchors(markup)
  })
})
