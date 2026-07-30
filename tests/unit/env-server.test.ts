import { createRequire } from 'node:module'

import { describe, expect, it } from 'vitest'

import { parseServerEnv } from '@/env/server'

const require = createRequire(import.meta.url)
const ConnectionParameters = require('pg/lib/connection-parameters')

const validProductionEnv = () => ({
  NODE_ENV: 'production',
  DATABASE_URL:
    'postgresql://test-user:synthetic-db-password@db.example.invalid/app?sslmode=verify-full',
  NEXT_PUBLIC_APP_URL: 'https://www.example.com',
  ADMIN_EMAIL: 'admin@example.invalid',
  ADMIN_PASSWORD: 'test-only-admin-password',
  ADMIN_SECRET: 'admin-test-secret-with-at-least-32-characters',
  USER_AUTH_SECRET: 'user-test-secret-with-at-least-32-characters',
})

describe('server environment validation', () => {
  it('keeps the unfinished customer portal disabled and rejects enablement', () => {
    expect(parseServerEnv(validProductionEnv()).ENABLE_CUSTOMER_PORTAL).toBe(false)
    expect(
      parseServerEnv({
        ...validProductionEnv(),
        ENABLE_CUSTOMER_PORTAL: 'false',
      }).ENABLE_CUSTOMER_PORTAL
    ).toBe(false)
    expect(() =>
      parseServerEnv({
        ...validProductionEnv(),
        ENABLE_CUSTOMER_PORTAL: 'true',
      })
    ).toThrow('Invalid environment variables: ENABLE_CUSTOMER_PORTAL')
  })

  it('rejects a missing production ADMIN_SECRET without leaking supplied values', () => {
    const input = validProductionEnv()
    delete (input as Partial<typeof input>).ADMIN_SECRET

    let message = ''
    try {
      parseServerEnv(input)
    } catch (error) {
      message = error instanceof Error ? error.message : String(error)
    }

    expect(message).toBe('Invalid environment variables: ADMIN_SECRET')
    for (const value of Object.values(input)) {
      expect(message).not.toContain(value)
    }
  })

  it('rejects a short production ADMIN_SECRET without echoing it', () => {
    const input = { ...validProductionEnv(), ADMIN_SECRET: 'too-short-secret' }

    expect(() => parseServerEnv(input)).toThrow(
      'Invalid environment variables: ADMIN_SECRET'
    )
    try {
      parseServerEnv(input)
    } catch (error) {
      expect(String(error)).not.toContain(input.ADMIN_SECRET)
    }
  })

  it('rejects a missing production USER_AUTH_SECRET', () => {
    const input = validProductionEnv()
    delete (input as Partial<typeof input>).USER_AUTH_SECRET

    expect(() => parseServerEnv(input)).toThrow(
      'Invalid environment variables: USER_AUTH_SECRET'
    )
  })

  it('rejects a short production USER_AUTH_SECRET', () => {
    const input = { ...validProductionEnv(), USER_AUTH_SECRET: 'too-short' }

    expect(() => parseServerEnv(input)).toThrow(
      'Invalid environment variables: USER_AUTH_SECRET'
    )
  })

  it.each([
    ['missing', undefined],
    ['wrong protocol', 'https://db.example.invalid/app'],
    ['malformed', 'not-a-database-url'],
  ])('rejects a %s production DATABASE_URL', (_label, databaseUrl) => {
    const input = { ...validProductionEnv(), DATABASE_URL: databaseUrl }

    expect(() => parseServerEnv(input)).toThrow(
      'Invalid environment variables: DATABASE_URL'
    )
    if (databaseUrl) {
      try {
        parseServerEnv(input)
      } catch (error) {
        expect(String(error)).not.toContain(databaseUrl)
      }
    }
  })

  it.each([
    ['missing TLS mode', 'postgresql://user:password@db.example.com/app'],
    ['TLS disabled', 'postgresql://user:password@db.example.com/app?sslmode=disable'],
    ['TLS without certificate verification', 'postgresql://user:password@db.example.com/app?sslmode=require'],
    ['explicit no-verify', 'postgresql://user:password@db.example.com/app?sslmode=no-verify'],
  ])('rejects production DATABASE_URL with %s', (_label, databaseUrl) => {
    expect(() =>
      parseServerEnv({ ...validProductionEnv(), DATABASE_URL: databaseUrl })
    ).toThrow('Invalid environment variables: DATABASE_URL')
  })

  it.each([
    [
      'verified then disabled',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&sslmode=disable',
    ],
    [
      'disabled then verified',
      'postgresql://user:synthetic@db.example.com/app?sslmode=disable&sslmode=verify-full',
    ],
    [
      'duplicate verified modes',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&sslmode=verify-full',
    ],
    [
      'encoded duplicate parameter name',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&ssl%6dode=disable',
    ],
    [
      'mixed-case bypass parameter',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&SSLMODE=disable',
    ],
    [
      'explicit pg ssl override',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&ssl=false',
    ],
    [
      'encoded pg ssl override',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&%73sl=false',
    ],
    [
      'singleton mixed-case mode name',
      'postgresql://user:synthetic@db.example.com/app?SSLMODE=verify-full',
    ],
    [
      'singleton encoded mode name',
      'postgresql://user:synthetic@db.example.com/app?ssl%6dode=verify-full',
    ],
    [
      'query host override',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&host=127.0.0.1',
    ],
    [
      'encoded socket host override',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full&host=%2Ftmp',
    ],
    [
      'direct IPv4 endpoint',
      'postgresql://user:synthetic@127.0.0.1/app?sslmode=verify-full',
    ],
    [
      'short IPv4 endpoint',
      'postgresql://user:synthetic@127.1/app?sslmode=verify-full',
    ],
    [
      'decimal IPv4 endpoint',
      'postgresql://user:synthetic@2130706433/app?sslmode=verify-full',
    ],
    [
      'hexadecimal IPv4 endpoint',
      'postgresql://user:synthetic@0x7f000001/app?sslmode=verify-full',
    ],
    [
      'octal IPv4 endpoint',
      'postgresql://user:synthetic@0177.0.0.1/app?sslmode=verify-full',
    ],
    [
      'direct IPv6 endpoint',
      'postgresql://user:synthetic@[::1]/app?sslmode=verify-full',
    ],
    [
      'fragment ambiguity',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full#ignored',
    ],
    [
      'empty fragment ambiguity',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-full#',
    ],
    [
      'encoded hostname character',
      'postgresql://user:synthetic@%64b.example.com/app?sslmode=verify-full',
    ],
    [
      'encoded Unicode hostname',
      'postgresql://user:synthetic@b%C3%BCcher.example/app?sslmode=verify-full',
    ],
    [
      'hostname underscore',
      'postgresql://user:synthetic@_db.example.com/app?sslmode=verify-full',
    ],
    [
      'leading hostname hyphen',
      'postgresql://user:synthetic@-db.example.com/app?sslmode=verify-full',
    ],
    [
      'trailing hostname hyphen',
      'postgresql://user:synthetic@db-.example.com/app?sslmode=verify-full',
    ],
    [
      'empty hostname label',
      'postgresql://user:synthetic@db..example.com/app?sslmode=verify-full',
    ],
    [
      'trailing hostname dot',
      'postgresql://user:synthetic@db.example.com./app?sslmode=verify-full',
    ],
    [
      'newline-normalized TLS mode',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-\nfull',
    ],
    [
      'tab-normalized TLS mode',
      'postgresql://user:synthetic@db.example.com/app?sslmode=verify-\tfull',
    ],
  ])('rejects production DATABASE_URL with %s', (_label, databaseUrl) => {
    expect(() =>
      parseServerEnv({ ...validProductionEnv(), DATABASE_URL: databaseUrl })
    ).toThrow('Invalid environment variables: DATABASE_URL')
  })

  it('accepts only a URL that pg interprets as verified TLS', () => {
    const parsed = parseServerEnv(validProductionEnv())
    if (!parsed.DATABASE_URL) throw new Error('expected a validated database URL')
    const connection = new ConnectionParameters(parsed.DATABASE_URL)
    const validatedUrl = new URL(parsed.DATABASE_URL)

    expect(connection.ssl).toBeTruthy()
    expect(connection.ssl.rejectUnauthorized).not.toBe(false)
    expect(connection.host).toBe(validatedUrl.hostname)
    expect(connection.isDomainSocket).toBe(false)
  })

  it.each([
    ['missing', undefined],
    ['plain HTTP', 'http://www.example.invalid'],
    ['localhost', 'https://localhost:3013'],
    ['loopback', 'https://127.0.0.1:3013'],
    ['unspecified host', 'https://0.0.0.0:3013'],
    ['credentials', 'https://user:password@www.example.invalid'],
    ['query', 'https://www.example.invalid?unsafe=true'],
    ['fragment', 'https://www.example.invalid#unsafe'],
    ['private IPv4', 'https://192.168.1.1'],
    ['private class A IPv4', 'https://10.0.0.1'],
    ['link-local IPv4', 'https://169.254.169.254'],
    ['IPv6 literal', 'https://[fc00::1]'],
    ['single-label internal host', 'https://internal'],
    ['trailing-dot localhost', 'https://localhost.'],
    ['trailing-dot internal suffix', 'https://app.internal.'],
    ['trailing-dot local suffix', 'https://app.local.'],
    ['trailing-dot reserved suffix', 'https://app.invalid.'],
    ['reserved example TLD', 'https://app.example'],
    ['empty registrable label', 'https://.com'],
    ['empty interior label', 'https://foo..com'],
    ['leading label hyphen', 'https://-foo.com'],
    ['trailing label hyphen', 'https://foo-.com'],
    ['invalid label underscore', 'https://foo_bar.com'],
    ['localhost subdomain', 'https://app.localhost'],
    ['reserved internal suffix', 'https://app.internal'],
    ['non-root path', 'https://www.example.com/base'],
    ['explicit port', 'https://www.example.com:8443'],
    ['explicit default port', 'https://www.example.com:443'],
    ['empty query delimiter', 'https://www.example.com?'],
    ['empty fragment delimiter', 'https://www.example.com#'],
    ['empty username delimiter', 'https://@www.example.com'],
    ['empty credentials delimiters', 'https://:@www.example.com'],
    ['normalized dot path', 'https://www.example.com/.'],
    ['encoded normalized dot path', 'https://www.example.com/%2e'],
    ['normalized parent path', 'https://www.example.com/foo/..'],
    ['normalized double-slash parent path', 'https://www.example.com//..'],
    ['leading whitespace', ' https://www.example.com'],
    ['trailing whitespace', 'https://www.example.com '],
  ])('rejects a %s production NEXT_PUBLIC_APP_URL', (_label, appUrl) => {
    const input = { ...validProductionEnv(), NEXT_PUBLIC_APP_URL: appUrl }

    expect(() => parseServerEnv(input)).toThrow(
      'Invalid environment variables: NEXT_PUBLIC_APP_URL'
    )
  })

  it('accepts a canonical public HTTPS origin with an optional root slash', () => {
    expect(
      parseServerEnv({
        ...validProductionEnv(),
        NEXT_PUBLIC_APP_URL: 'https://www.example.com/',
      }).NEXT_PUBLIC_APP_URL
    ).toBe('https://www.example.com')
  })

  it('rejects an unknown NODE_ENV', () => {
    expect(() =>
      parseServerEnv({
        NODE_ENV: 'staging',
        ADMIN_SECRET: 'admin-test-secret-with-at-least-32-characters',
        USER_AUTH_SECRET: 'user-test-secret-with-at-least-32-characters',
      })
    ).toThrow('Invalid environment variables: NODE_ENV')
  })

  it('rejects a missing NODE_ENV instead of defaulting to development', () => {
    expect(() =>
      parseServerEnv({
        ADMIN_SECRET: 'admin-test-secret-with-at-least-32-characters',
        USER_AUTH_SECRET: 'user-test-secret-with-at-least-32-characters',
      })
    ).toThrow('Invalid environment variables: NODE_ENV')
  })

  it.each([
    ['client ID only', { GOOGLE_CLIENT_ID: 'test-client-id' }],
    ['client secret only', { GOOGLE_CLIENT_SECRET: 'test-client-secret' }],
  ])('rejects one-sided Google OAuth configuration: %s', (_label, google) => {
    expect(() => parseServerEnv({ ...validProductionEnv(), ...google })).toThrow(
      'Invalid environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET'
    )
  })

  it('requires an admin email allowlist when Google OAuth is configured', () => {
    expect(() =>
      parseServerEnv({
        ...validProductionEnv(),
        GOOGLE_CLIENT_ID: 'test-client-id',
        GOOGLE_CLIENT_SECRET: 'test-client-secret',
      })
    ).toThrow('Invalid environment variables: ADMIN_GOOGLE_EMAILS')
  })

  it('rejects malformed Google admin allowlist entries', () => {
    expect(() =>
      parseServerEnv({
        ...validProductionEnv(),
        GOOGLE_CLIENT_ID: 'test-client-id',
        GOOGLE_CLIENT_SECRET: 'test-client-secret',
        ADMIN_GOOGLE_EMAILS: 'not-an-email',
      })
    ).toThrow('Invalid environment variables: ADMIN_GOOGLE_EMAILS')
  })

  it('allows database and public URL settings to remain absent locally', () => {
    const parsed = parseServerEnv({
      NODE_ENV: 'development',
      ADMIN_SECRET: 'admin-test-secret-with-at-least-32-characters',
      USER_AUTH_SECRET: 'user-test-secret-with-at-least-32-characters',
    })

    expect(parsed.DATABASE_URL).toBeUndefined()
    expect(parsed.NEXT_PUBLIC_APP_URL).toBeUndefined()
  })

  it('allows a positive auth-contract user only in development', () => {
    const parsed = parseServerEnv({
      NODE_ENV: 'development',
      ADMIN_SECRET: 'admin-test-secret-with-at-least-32-characters',
      USER_AUTH_SECRET: 'user-test-secret-with-at-least-32-characters',
      SELA_AUTH_CONTRACT_USER_ID: '1',
    })

    expect(parsed.SELA_AUTH_CONTRACT_USER_ID).toBe(1)
  })

  it('rejects an auth-contract user in production', () => {
    expect(() =>
      parseServerEnv({
        ...validProductionEnv(),
        SELA_AUTH_CONTRACT_USER_ID: '1',
      })
    ).toThrow('Invalid environment variables: SELA_AUTH_CONTRACT_USER_ID')
  })

  it('requires both signing secrets outside production too', () => {
    expect(() => parseServerEnv({ NODE_ENV: 'development' })).toThrow(
      'Invalid environment variables: ADMIN_SECRET, USER_AUTH_SECRET'
    )
  })

  it('rejects equal admin and user signing secrets without leaking them', () => {
    const sharedSecret = 'shared-test-secret-with-at-least-32-characters'
    const input = {
      ...validProductionEnv(),
      ADMIN_SECRET: sharedSecret,
      USER_AUTH_SECRET: sharedSecret,
    }

    expect(() => parseServerEnv(input)).toThrow(
      'Invalid environment variables: ADMIN_SECRET, USER_AUTH_SECRET'
    )
    try {
      parseServerEnv(input)
    } catch (error) {
      expect(String(error)).not.toContain(sharedSecret)
    }
  })
})
