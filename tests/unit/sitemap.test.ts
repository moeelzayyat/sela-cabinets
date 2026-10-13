import { describe, expect, it, vi } from 'vitest'

import sitemap from '@/app/sitemap'
import { indexableRoutes } from '@/config/indexable-routes'

const expectedUrls = indexableRoutes.map((route) =>
  route === '/' ? 'https://selacabinets.com/' : `https://selacabinets.com${route}`
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
    expect(first.every((entry) => entry.lastModified !== undefined)).toBe(true)
    expect(first.every((entry) => new Date(entry.lastModified!).getTime() <= Date.now())).toBe(true)
    expect(first.map((entry) => new Date(entry.lastModified!).toISOString()))
      .toEqual(second.map((entry) => new Date(entry.lastModified!).toISOString()))
    expect(first.find((entry) => entry.url.endsWith('/contact'))?.lastModified)
      .toEqual(new Date('2026-10-06T00:00:00.000Z'))
    expect(first.find((entry) => entry.url.endsWith('/service-areas/detroit'))?.lastModified)
      .toEqual(new Date('2026-10-12T00:00:00.000Z'))
  })
})
