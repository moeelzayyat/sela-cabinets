import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Docker production build dependencies', () => {
  it('installs development dependencies required by Next.js compilation even when NODE_ENV is production', () => {
    const dockerfile = readFileSync('Dockerfile', 'utf8')

    expect(dockerfile).toContain('npm ci --include=dev')
    expect(dockerfile).toContain('npm install --include=dev')
  })
})
