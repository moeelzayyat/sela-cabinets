import fs from 'node:fs'

import { describe, expect, it, vi } from 'vitest'

import { startProductionServer } from '../../scripts/start-production.mjs'

const validEnvironment = () => ({
  NODE_ENV: 'production',
  ADMIN_SECRET: 'synthetic-admin-start-secret-at-least-32-characters',
  USER_AUTH_SECRET: 'synthetic-user-start-secret-at-least-32-characters',
  DATABASE_URL:
    'postgresql://test:synthetic-password@db.example.invalid:9/test?sslmode=verify-full',
  NEXT_PUBLIC_APP_URL: 'https://www.example.com',
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: '',
  ADMIN_GOOGLE_EMAILS: '',
})

describe('production server preflight', () => {
  it('is the authoritative package start command', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    expect(packageJson.scripts.start).toBe('node scripts/start-production.mjs')
  })

  it('rejects a non-production runtime mode before loading the server', async () => {
    const loadServer = vi.fn(async () => undefined)

    await expect(
      startProductionServer({
        environment: { ...validEnvironment(), NODE_ENV: 'development' },
        loadServer,
        serverPath: 'synthetic-server-path',
      })
    ).rejects.toThrow('Invalid environment variables: NODE_ENV')

    expect(loadServer).not.toHaveBeenCalled()
  })

  it('rejects invalid configuration before loading the standalone server', async () => {
    const loadServer = vi.fn(async () => undefined)

    await expect(
      startProductionServer({
        environment: { ...validEnvironment(), ADMIN_SECRET: '' },
        loadServer,
        serverPath: 'synthetic-server-path',
      })
    ).rejects.toThrow('Invalid environment variables: ADMIN_SECRET')

    expect(loadServer).not.toHaveBeenCalled()
  })

  it('rejects portal enablement before loading the standalone server', async () => {
    const loadServer = vi.fn(async () => undefined)

    await expect(
      startProductionServer({
        environment: {
          ...validEnvironment(),
          ENABLE_CUSTOMER_PORTAL: 'true',
        },
        loadServer,
        serverPath: 'synthetic-server-path',
      })
    ).rejects.toThrow('Invalid environment variables: ENABLE_CUSTOMER_PORTAL')

    expect(loadServer).not.toHaveBeenCalled()
  })

  it('rejects an insecure database URL before loading or opening the server', async () => {
    const loadServer = vi.fn(async () => undefined)

    await expect(
      startProductionServer({
        environment: {
          ...validEnvironment(),
          DATABASE_URL: 'postgresql://test:synthetic-password@db.example.com/app',
        },
        loadServer,
        serverPath: 'synthetic-server-path',
      })
    ).rejects.toThrow('Invalid environment variables: DATABASE_URL')

    expect(loadServer).not.toHaveBeenCalled()
  })

  it.each([
    ['leading space', (url: string) => ` ${url}`],
    ['trailing space', (url: string) => `${url} `],
    ['leading LF', (url: string) => `\n${url}`],
    ['trailing LF', (url: string) => `${url}\n`],
    ['leading CR', (url: string) => `\r${url}`],
    ['trailing CR', (url: string) => `${url}\r`],
    ['leading TAB', (url: string) => `\t${url}`],
    ['trailing TAB', (url: string) => `${url}\t`],
  ])('rejects DATABASE_URL with %s before loading', async (_label, mutate) => {
    const loadServer = vi.fn(async () => undefined)
    const valid = validEnvironment()

    await expect(
      startProductionServer({
        environment: { ...valid, DATABASE_URL: mutate(valid.DATABASE_URL) },
        loadServer,
        serverPath: 'synthetic-server-path',
      })
    ).rejects.toThrow('Invalid environment variables: DATABASE_URL')

    expect(loadServer).not.toHaveBeenCalled()
  })

  it('rejects an auth-contract fixture before loading the production server', async () => {
    const loadServer = vi.fn(async () => undefined)

    await expect(
      startProductionServer({
        environment: {
          ...validEnvironment(),
          SELA_AUTH_CONTRACT_USER_ID: '1',
        },
        loadServer,
        serverPath: 'synthetic-server-path',
      })
    ).rejects.toThrow('Invalid environment variables: SELA_AUTH_CONTRACT_USER_ID')

    expect(loadServer).not.toHaveBeenCalled()
  })

  it('loads the standalone server only after valid preflight', async () => {
    const loadServer = vi.fn(async () => undefined)

    await startProductionServer({
      environment: validEnvironment(),
      loadServer,
      serverPath: 'synthetic-server-path',
    })

    expect(loadServer).toHaveBeenCalledWith('synthetic-server-path')
  })
})
