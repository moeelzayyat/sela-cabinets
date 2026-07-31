import { afterEach, describe, expect, it } from 'vitest'

import robots from '@/app/robots'

const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL

function restoreAppUrl() {
  if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL
  else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl
}

afterEach(restoreAppUrl)

describe('robots metadata', () => {
  it('allows approved crawling only on the canonical production origin', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://selacabinets.com'

    const result = robots()

    expect(result.rules).toEqual([
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/account/', '/locations/', '/service-areas/'],
      },
    ])
    expect(result.sitemap).toBe('https://selacabinets.com/sitemap.xml')
  })

  it('blocks all crawling and omits the production sitemap off production', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://preview.example.invalid'

    const result = robots()

    expect(result.rules).toEqual([{ userAgent: '*', disallow: '/' }])
    expect(result.sitemap).toBeUndefined()
  })
})
