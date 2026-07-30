// @vitest-environment node

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Docker production build dependencies', () => {
  it('installs the audited Yarn lockfile including development build dependencies', () => {
    const dockerfile = readFileSync('Dockerfile', 'utf8')

    expect(dockerfile).toMatch(/COPY\s+package\.json\s+yarn\.lock\s+\.\//)
    expect(dockerfile).toContain('corepack enable')
    expect(dockerfile).toContain('yarn install --frozen-lockfile --production=false')
    expect(dockerfile).toContain('yarn build')
    expect(dockerfile).not.toMatch(/npm (?:ci|install)/)
  })
})
