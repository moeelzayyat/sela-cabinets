import type { PoolConfig } from 'pg'

import { usesVerifiedPostgresTls } from '@/env/server-schema.mjs'

export function createPostgresPoolConfig(
  connectionString: string | undefined,
  ca?: string
): PoolConfig {
  if (!connectionString) throw new Error('DATABASE_URL is required')
  if (!usesVerifiedPostgresTls(connectionString)) {
    throw new Error('Verified PostgreSQL TLS is required')
  }

  const url = new URL(connectionString)
  const servername = url.hostname
  url.search = ''

  return {
    connectionString: url.toString(),
    ssl: {
      ...(ca ? { ca } : {}),
      rejectUnauthorized: true,
      servername,
    },
  }
}
