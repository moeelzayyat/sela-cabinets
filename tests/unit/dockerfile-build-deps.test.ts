// @vitest-environment node

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Docker production build dependencies', () => {
  it('uses a Node runtime supported by the locked production dependencies', () => {
    const dockerfile = readFileSync('Dockerfile', 'utf8')
    const firstStageImage = dockerfile.match(/^\s*FROM\s+(\S+)/m)?.[1]

    expect(firstStageImage).toMatch(/^node:22(?:\b|[.@-])/)
  })

  it('installs the audited Yarn lockfile including development build dependencies', () => {
    const dockerfile = readFileSync('Dockerfile', 'utf8')

    expect(dockerfile).toMatch(/COPY\s+package\.json\s+yarn\.lock\s+\.\//)
    expect(dockerfile).toContain('corepack enable')
    expect(dockerfile).toContain('yarn install --frozen-lockfile --production=false')
    expect(dockerfile).toContain('yarn build')
    expect(dockerfile).not.toMatch(/npm (?:ci|install)/)
  })

  it('scopes all synthetic server values to the single application build process', () => {
    const dockerfile = readFileSync('Dockerfile', 'utf8')
    const logicalInstructions = dockerfile.replace(/\\\r?\n\s*/g, ' ')
    const buildInstruction = logicalInstructions.match(/^\s*RUN\s+([^\r\n]*\byarn build\s*)$/m)?.[1]
    const protectedNames = ['ADMIN_SECRET', 'USER_AUTH_SECRET', 'DATABASE_URL', 'DATABASE_CA_CERT']
    const persistentInstructions = logicalInstructions.match(/^\s*(?:ARG|ENV)\s+[^\r\n]*$/gm) ?? []

    expect(buildInstruction).toBeDefined()
    expect(buildInstruction).toContain('ADMIN_SECRET="build-only-admin-secret-not-for-runtime-000000"')
    expect(buildInstruction).toContain('USER_AUTH_SECRET="build-only-user-secret-not-for-runtime-111111"')
    expect(buildInstruction).toContain('DATABASE_URL="postgresql://build:build@db.build.invalid/build?sslmode=verify-full"')
    expect(buildInstruction).toContain('DATABASE_CA_CERT="-----BEGIN CERTIFICATE-----\\nMIIBsynthetic-only-for-build-contract\\n-----END CERTIFICATE-----"')
    for (const name of protectedNames) {
      expect(persistentInstructions.join('\n')).not.toMatch(new RegExp(`\\b${name}(?:\\s|=|$)`))
    }
  })
})
