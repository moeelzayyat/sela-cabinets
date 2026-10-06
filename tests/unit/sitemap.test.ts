import { describe, expect, it, vi } from 'vitest'

import sitemap from '@/app/sitemap'
import { indexableRoutes } from '@/config/indexable-routes'

const expectedUrls = indexableRoutes.map((route) =>
  route === '/' ? 'https://selacabinets.com' : `https://selacabinets.com${route}`
)

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
    const datedEntries = first.filter((entry) => entry.lastModified)
    expect(datedEntries).toHaveLength(1)
    expect(datedEntries[0]?.url).toBe('https://selacabinets.com/blog/kitchen-cabinet-planning-detroit')
    expect(datedEntries[0]?.lastModified).toEqual(new Date('2026-07-30T00:00:00.000Z'))
  })
})
