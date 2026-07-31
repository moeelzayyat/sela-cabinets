import { createRequire } from 'node:module'
import { afterEach, describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const nextConfig = require('../../next.config.js') as {
  headers: () => Promise<Array<{ source: string; headers: Array<{ key: string; value: string }> }>>
}
const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL

afterEach(() => {
  if (originalAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL
  else process.env.NEXT_PUBLIC_APP_URL = originalAppUrl
})

describe('deployment robots response header', () => {
  it('adds noindex and nofollow to every non-production response', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://preview.example.invalid'

    const rules = await nextConfig.headers()
    const catchAll = rules.find((rule) => rule.source === '/:path*')

    expect(catchAll?.headers).toContainEqual({
      key: 'X-Robots-Tag',
      value: 'noindex, nofollow',
    })
  })

  it('does not add a global noindex header on the canonical production origin', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://selacabinets.com'

    const rules = await nextConfig.headers()
    const headers = rules.flatMap((rule) => rule.headers)

    expect(headers.some((header) => header.key === 'X-Robots-Tag')).toBe(false)
  })
})
