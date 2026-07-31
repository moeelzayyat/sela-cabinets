import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/config/site'

const unsupportedPositioning = /\b(years of experience|installed perfectly|premium|luxury|semi-custom|custom kitchen cabinets|showroom|best kitchen cabinet company)\b/i

describe('public content truthfulness', () => {
  it('keeps service and SEO positioning within verified capabilities', () => {
    expect(JSON.stringify(siteConfig.services)).not.toMatch(unsupportedPositioning)
    expect(siteConfig.seo.keywords.join(' ')).not.toMatch(unsupportedPositioning)
    expect(JSON.stringify(siteConfig.faqs)).not.toMatch(unsupportedPositioning)

    const trustSection = readFileSync(
      resolve(process.cwd(), 'src', 'components', 'sections', 'trust-section.tsx'),
      'utf8'
    )
    const pricingPage = readFileSync(
      resolve(process.cwd(), 'src', 'app', 'pricing', 'page.tsx'),
      'utf8'
    )
    expect(trustSection).not.toMatch(unsupportedPositioning)
    expect(pricingPage).not.toMatch(unsupportedPositioning)
  })

  it('keeps the obsolete cost route redirect-only if Next config is bypassed', () => {
    const oldRoute = readFileSync(
      resolve(process.cwd(), 'src', 'app', 'blog', 'kitchen-cabinet-costs-detroit', 'page.tsx'),
      'utf8'
    )

    expect(oldRoute).toContain("permanentRedirect('/blog/kitchen-cabinet-planning-detroit')")
    expect(oldRoute).not.toMatch(unsupportedPositioning)
  })

  it('states the verified cabinet-removal boundary without promising disposal or an unverified fee', () => {
    const removal = siteConfig.faqs.find((faq) => faq.question === 'Do you remove old cabinets?')

    expect(removal?.answer).toContain('Removed cabinets remain at the property')
    expect(removal?.answer).toContain('customer is responsible for disposal')
    expect(removal?.answer).not.toMatch(/we dispose|includes .*disposal|haul away|additional fee/i)
  })

  it('does not publish an unverified street or storefront address in LocalBusiness schema', () => {
    const markup = renderToStaticMarkup(<LocalBusinessJsonLd />)
    const body = markup.match(/<script[^>]*>(.*)<\/script>/)?.[1]
    expect(body).toBeTruthy()

    const schema = JSON.parse(body ?? '{}') as Record<string, unknown>
    expect(schema).not.toHaveProperty('address')
  })
})
