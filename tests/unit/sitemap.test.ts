import { describe, expect, it, vi } from 'vitest'

import sitemap from '@/app/sitemap'

const expectedUrls = [
  'https://selacabinets.com',
  'https://selacabinets.com/services',
  'https://selacabinets.com/services/kitchen-cabinet-installation-detroit',
  'https://selacabinets.com/services/kitchen-cabinet-supply-detroit',
  'https://selacabinets.com/services/in-home-cabinet-measurement',
  'https://selacabinets.com/service-areas/metro-detroit',
  'https://selacabinets.com/products',
  'https://selacabinets.com/pricing',
  'https://selacabinets.com/gallery',
  'https://selacabinets.com/about',
  'https://selacabinets.com/faqs',
  'https://selacabinets.com/contact',
  'https://selacabinets.com/book',
  'https://selacabinets.com/estimate',
  'https://selacabinets.com/blog',
  'https://selacabinets.com/blog/kitchen-cabinet-planning-detroit',
]

describe('production sitemap', () => {
  it('uses only approved routes and never assigns request-time modification dates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-01T00:00:00.000Z'))

    const first = sitemap()
    vi.setSystemTime(new Date('2031-01-01T00:00:00.000Z'))
    const second = sitemap()
    vi.useRealTimers()

    expect(first.map((entry) => entry.url)).toEqual(expectedUrls)
    expect(second).toEqual(first)
    expect(first.slice(0, -1).every((entry) => entry.lastModified === undefined)).toBe(true)
    expect(first.at(-1)?.lastModified).toEqual(new Date('2026-07-30T00:00:00.000Z'))
  })
})
