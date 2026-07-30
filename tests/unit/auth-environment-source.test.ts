// @vitest-environment node

import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const signingConsumers = [
  'src/lib/auth.ts',
  'src/lib/user-auth.ts',
  'src/middleware.ts',
]

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(entryPath)
    return entryPath.endsWith('.ts') || entryPath.endsWith('.tsx')
      ? [entryPath]
      : []
  })
}

describe('signing secret consumers', () => {
  it.each(signingConsumers)(
    '%s uses centralized validated secrets without direct fallbacks',
    (fileName) => {
      const source = readFileSync(fileName, 'utf8')
      const readsSigningEnvironmentDirectly =
        /process\.env\.(?:ADMIN_SECRET|USER_AUTH_SECRET)/.test(source)
      const importsValidatedServerEnvironment =
        /from ['"]@\/env\/server-runtime['"]/.test(source)

      expect(readsSigningEnvironmentDirectly).toBe(false)
      expect(importsValidatedServerEnvironment).toBe(true)
    }
  )
})

describe('database configuration consumers', () => {
  it('uses one validated DATABASE_URL without checked-in connection fallbacks', () => {
    const databaseSource = readFileSync('src/lib/db.ts', 'utf8')
    const adminDatabaseSource = readFileSync('src/lib/db-admin.ts', 'utf8')

    expect(databaseSource).not.toMatch(/process\.env\.(?:DATABASE_URL|DB_\w+)/)
    expect(databaseSource).toMatch(/from ['"]@\/env\/server-runtime['"]/)
    expect(databaseSource).toMatch(/createPostgresPoolConfig\(/)
    expect(databaseSource).toMatch(/serverEnv\.DATABASE_URL/)
    expect(databaseSource).toMatch(/serverEnv\.DATABASE_CA_CERT/)
    expect(databaseSource).not.toMatch(/rejectUnauthorized:\s*false|ssl:\s*false/)

    expect(adminDatabaseSource).not.toMatch(/process\.env|new Pool|password\s*:/)
    expect(adminDatabaseSource).toMatch(/from ['"]@\/lib\/db['"]/)
  })

  it('constructs exactly one PostgreSQL pool for all server consumers', () => {
    const poolConstructors = sourceFiles('src').filter((fileName) =>
      /new Pool\s*\(/.test(readFileSync(fileName, 'utf8'))
    )

    expect(poolConstructors).toEqual([path.join('src', 'lib', 'db.ts')])
  })
})

describe('browser credential consumers', () => {
  it('does not embed legacy API keys or bearer headers in client modules', () => {
    const unsafeClientFiles = sourceFiles('src').filter((fileName) => {
      const source = readFileSync(fileName, 'utf8')
      return (
        /^['"]use client['"]/m.test(source) &&
        (/\bAPI_KEY\b/.test(source) || /Authorization[^\n]+Bearer/.test(source))
      )
    })

    expect(unsafeClientFiles).toEqual([])
  })
})
