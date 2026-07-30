import { describe, expect, it } from 'vitest'

import { createPostgresPoolConfig } from '@/lib/postgres-config'

const verifiedUrl =
  'postgresql://user:password@managed-db.internal/app?sslmode=verify-full'

describe('PostgreSQL pool TLS configuration', () => {
  it('rejects a missing connection URL instead of using ambient PG variables', () => {
    expect(() => createPostgresPoolConfig(undefined)).toThrow(
      'DATABASE_URL is required'
    )
  })

  it('explicitly verifies publicly trusted database certificates and hostname', () => {
    expect(createPostgresPoolConfig(verifiedUrl)).toEqual({
      connectionString: 'postgresql://user:password@managed-db.internal/app',
      ssl: {
        rejectUnauthorized: true,
        servername: 'managed-db.internal',
      },
    })
  })

  it('uses a private CA without allowing the URL parser to override it', () => {
    const ca = '-----BEGIN CERTIFICATE-----\ntest-ca\n-----END CERTIFICATE-----'
    const config = createPostgresPoolConfig(verifiedUrl, ca)

    expect(config.connectionString).toBe(
      'postgresql://user:password@managed-db.internal/app'
    )
    expect(config.ssl).toEqual({
      ca,
      rejectUnauthorized: true,
      servername: 'managed-db.internal',
    })
  })

  it.each(['require', 'prefer', 'disable'])(
    'rejects sslmode=%s with and without a private CA',
    (sslmode) => {
      const insecureUrl = `postgresql://user:password@managed-db.internal/app?sslmode=${sslmode}`
      expect(() => createPostgresPoolConfig(insecureUrl)).toThrow(
        'Verified PostgreSQL TLS is required'
      )
      expect(() => createPostgresPoolConfig(insecureUrl, 'private-ca')).toThrow(
        'Verified PostgreSQL TLS is required'
      )
    }
  )

  it.each([
    '127.0.0.1',
    '127.1',
    '2130706433',
    '0x7f000001',
    '0177.0.0.1',
    '[::1]',
    'localhost',
  ])(
    'rejects non-DNS database authority %s',
    (host) => {
      expect(() =>
        createPostgresPoolConfig(
          `postgresql://user:password@${host}/app?sslmode=verify-full`,
          'private-ca'
        )
      ).toThrow('Verified PostgreSQL TLS is required')
    }
  )

  it('rejects localhost subdomains and unrelated URL schemes', () => {
    expect(() =>
      createPostgresPoolConfig(
        'postgresql://user:password@db.localhost/app?sslmode=verify-full',
        'private-ca'
      )
    ).toThrow('Verified PostgreSQL TLS is required')
    expect(() =>
      createPostgresPoolConfig(
        'https://user:password@managed-db.internal/app?sslmode=verify-full',
        'private-ca'
      )
    ).toThrow('Verified PostgreSQL TLS is required')
  })
})
