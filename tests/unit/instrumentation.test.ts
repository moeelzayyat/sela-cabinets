import fs from 'node:fs'

import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

describe('production environment startup validation', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('uses Next.js 16 automatic instrumentation discovery', () => {
    const config = fs.readFileSync('next.config.js', 'utf8')
    expect(config).not.toMatch(/instrumentationHook/)
    expect(fs.existsSync('src/instrumentation.ts')).toBe(true)
  })

  it('aborts startup registration when production configuration is invalid', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('ADMIN_SECRET', '')
    vi.stubEnv(
      'USER_AUTH_SECRET',
      'synthetic-user-startup-secret-at-least-32-characters'
    )
    vi.stubEnv(
      'DATABASE_URL',
      'postgresql://test:synthetic-password@db.example.invalid:9/test?sslmode=verify-full'
    )
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://www.example.com')
    vi.stubEnv('GOOGLE_CLIENT_ID', '')
    vi.stubEnv('GOOGLE_CLIENT_SECRET', '')
    vi.stubEnv('ADMIN_GOOGLE_EMAILS', '')

    const { register } = await import('@/instrumentation')

    await expect(register()).rejects.toThrow(
      'Invalid environment variables: ADMIN_SECRET'
    )
  })
})
