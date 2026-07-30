import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const nextConfig = require(resolve(process.cwd(), 'next.config.js')) as {
  headers?: () => Promise<
    Array<{
      source: string
      headers: Array<{ key: string; value: string }>
    }>
  >
}

describe('public security headers', () => {
  it('sets launch security headers on every route without blocking Calendly', async () => {
    expect(nextConfig.headers).toBeTypeOf('function')
    const rules = await nextConfig.headers!()
    const global = rules.find((rule) => rule.source === '/:path*')
    const headers = Object.fromEntries(
      (global?.headers ?? []).map(({ key, value }) => [key.toLowerCase(), value])
    )

    expect(headers['strict-transport-security']).toContain('max-age=31536000')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['permissions-policy']).toContain('geolocation=()')
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'")
    expect(headers['content-security-policy']).toContain('https://calendly.com')
    expect(headers['content-security-policy']).toContain('https://assets.calendly.com')
    expect(headers['content-security-policy']).not.toContain("'unsafe-eval'")
  })
})
