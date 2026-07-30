import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/config/site'

function parseJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]')
  if (!script?.textContent) throw new Error('JSON-LD script was not rendered')
  return JSON.parse(script.textContent) as Record<string, unknown>
}

describe('public structured data', () => {
  it('uses configured business details without unverified operating claims', () => {
    const { container } = render(<LocalBusinessJsonLd />)
    const schema = parseJsonLd(container)

    expect(schema.name).toBe(siteConfig.name)
    expect(schema.email).toBe(siteConfig.email)
    expect(schema.telephone).toBe(siteConfig.phone)
    expect(schema).not.toHaveProperty('openingHoursSpecification')
    expect(schema).not.toHaveProperty('aggregateRating')
    expect(schema).not.toHaveProperty('paymentAccepted')
  })

  it('builds breadcrumb item URLs from the canonical configured origin', () => {
    const { container } = render(
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }]} />
    )
    const schema = parseJsonLd(container)
    const items = schema.itemListElement as Array<{ item: string }>

    expect(items[0].item).toBe(`${siteConfig.seo.url}/`)
  })
})
