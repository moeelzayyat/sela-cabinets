import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  localWebServerCommand,
  resolvePlaywrightEnvironment,
  resolvePlaywrightTarget,
  safeLocalWebServerEnvironment,
} from '../../playwright.config'

describe('Playwright target safety', () => {
  it('allows the default loopback target without external opt-in', () => {
    expect(resolvePlaywrightTarget(undefined, false)).toBe('http://127.0.0.1:3013')
  })

  it('allows IPv6 loopback without external opt-in', () => {
    expect(resolvePlaywrightTarget('http://[::1]:3013', false)).toBe(
      'http://[::1]:3013'
    )
  })

  it('rejects non-http protocols', () => {
    expect(() => resolvePlaywrightTarget('file:///etc/passwd', true)).toThrow(
      'must use http or https'
    )
  })

  it('rejects external hosts without explicit opt-in', () => {
    expect(() => resolvePlaywrightTarget('https://staging.example.com', false)).toThrow(
      'SELA_PLAYWRIGHT_ALLOW_EXTERNAL=true'
    )
  })

  it('rejects a deployed target without a separate deployed-target opt-in', () => {
    expect(() =>
      resolvePlaywrightTarget('https://staging.example.com', true)
    ).toThrow('SELA_PLAYWRIGHT_ALLOW_DEPLOYED=true')
  })

  it('allows an external https target with both explicit opt-ins', () => {
    expect(
      resolvePlaywrightTarget('https://staging.example.com', true, false, true)
    ).toBe(
      'https://staging.example.com'
    )
  })

  it('rejects an external auth-contract target even with external opt-in', () => {
    expect(() =>
      resolvePlaywrightTarget('https://staging.example.com', true, true)
    ).toThrow('Auth contract tests require a loopback SELA_PLAYWRIGHT_BASE_URL')
  })

  it('applies auth-contract loopback enforcement through environment resolution', () => {
    expect(() =>
      resolvePlaywrightEnvironment(
        {
          SELA_PLAYWRIGHT_BASE_URL: 'https://production.example.invalid',
          SELA_PLAYWRIGHT_ALLOW_EXTERNAL: 'true',
          SELA_PLAYWRIGHT_ALLOW_DEPLOYED: 'true',
        },
        true
      )
    ).toThrow('Auth contract tests require a loopback SELA_PLAYWRIGHT_BASE_URL')
  })

  it.each([
    'http://localhost:3013',
    'http://[::1]:3013',
    'http://127.0.0.1:3014',
  ])('rejects unmanaged custom loopback target %s', (baseURL) => {
    expect(() =>
      resolvePlaywrightEnvironment({ SELA_PLAYWRIGHT_BASE_URL: baseURL })
    ).toThrow('Local tests require http://127.0.0.1:3013')
  })

  it('ignores generic Playwright target variables from unrelated projects', () => {
    expect(
      resolvePlaywrightEnvironment({
        PLAYWRIGHT_BASE_URL: 'https://production.example.invalid',
        PLAYWRIGHT_ALLOW_EXTERNAL: 'true',
      })
    ).toEqual({
      externalBaseURL: undefined,
      baseURL: 'http://127.0.0.1:3013',
      allowExternal: false,
      allowDeployed: false,
      useLocalWebServer: true,
    })
  })

  it('still starts the isolated server when the exact local URL is explicit', () => {
    expect(
      resolvePlaywrightEnvironment({
        SELA_PLAYWRIGHT_BASE_URL: 'http://127.0.0.1:3013',
      }).useLocalWebServer
    ).toBe(true)
  })

  it('uses a cross-platform Node isolation wrapper', () => {
    expect(localWebServerCommand()).toBe(
      'node scripts/run-isolated-test-server.mjs'
    )
  })

  it('runs the auth contract through a dedicated loopback-only configuration', () => {
    const packageJson = JSON.parse(
      readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
    )
    expect(packageJson.scripts['test:auth']).toContain(
      '--config=playwright.auth.config.ts'
    )
  })

  it('replaces data and outbound-service credentials for the local test server', () => {
    const environment = safeLocalWebServerEnvironment({
      DATABASE_URL: 'postgres://production.example/customer-data',
      OPENAI_API_KEY: 'live-model-key',
      RESEND_API_KEY: 'live-email-key',
      ADMIN_SECRET: 'live-admin-secret',
      AWS_SECRET_ACCESS_KEY: 'unrelated-cloud-secret',
      PATH: 'test-path',
    })

    expect(environment).toMatchObject({
      DATABASE_URL: 'postgresql://test:test@db.example.invalid:1/sela_auth_contract_no_database?sslmode=verify-full',
      DB_HOST: '127.0.0.1',
      DB_PORT: '1',
      OPENAI_API_KEY: '',
      RESEND_API_KEY: '',
      NEXT_PUBLIC_SUPABASE_URL: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
    })
    expect(environment.PATH).toBe('test-path')
    expect(environment.ADMIN_SECRET).not.toBe('live-admin-secret')
    expect(environment).not.toHaveProperty('AWS_SECRET_ACCESS_KEY')
  })
})
