import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Docker standalone runtime assets', () => {
  it('copies Next static chunks and public files into the standalone server directory', () => {
    const dockerfile = readFileSync('Dockerfile', 'utf8')

    expect(dockerfile).toContain('cp -r /app/.next/static /app/.next/standalone/.next/static')
    expect(dockerfile).toContain('cp -r /app/public /app/.next/standalone/public')
  })
})
