import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const fromRoot = (...parts: string[]) => resolve(process.cwd(), ...parts)
const read = (...parts: string[]) => readFileSync(fromRoot(...parts), 'utf8')

const brandSvgs = [
  'public/brand/sela-wordmark-primary.svg',
  'public/brand/sela-wordmark-white.svg',
  'public/brand/sela-icon-contained.svg',
] as const

describe('approved SELA Cabinets brand integration', () => {
  it('ships the approved flat vector artwork without effects or live text', () => {
    for (const relativePath of brandSvgs) {
      expect(existsSync(fromRoot(relativePath)), relativePath).toBe(true)
      const svg = read(relativePath)
      expect(svg, relativePath).toContain('<path')
      expect(svg, relativePath).not.toMatch(/<(?:text|linearGradient|radialGradient|filter|pattern)\b/)
      expect(svg, relativePath).not.toMatch(/\b(?:opacity|style)=/)
    }

    expect(read('public/brand/sela-wordmark-primary.svg')).toContain('#16232E')
    expect(read('public/brand/sela-wordmark-primary.svg')).toContain('#1F5F5B')
  })

  it('uses the approved primary wordmark in the public header and footer', () => {
    const header = read('src/components/layout/header.tsx')
    const footer = read('src/components/layout/footer.tsx')

    expect(header).toContain("'/brand/sela-wordmark-primary.svg'")
    expect(header).toContain('alt={siteConfig.name}')
    expect(header).not.toContain('>S</span>')
    expect(footer).toContain("'/brand/sela-wordmark-white.svg'")
    expect(footer).toContain('alt={siteConfig.name}')
    expect(footer).not.toContain('>S</span>')
  })

  it('publishes the compact mark for schema, browser, Apple, and direct favicon requests', () => {
    const siteConfig = read('src/config/site.ts')
    expect(siteConfig).toContain("logo: '/brand/sela-icon-contained.svg'")

    for (const relativePath of [
      'src/app/favicon.ico',
      'src/app/icon.svg',
      'src/app/apple-icon.png',
      'public/favicon.ico',
    ]) {
      expect(existsSync(fromRoot(relativePath)), relativePath).toBe(true)
    }

    const appleIcon = readFileSync(fromRoot('src/app/apple-icon.png'))
    expect(appleIcon.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(appleIcon.readUInt32BE(16)).toBe(180)
    expect(appleIcon.readUInt32BE(20)).toBe(180)

    const favicon = readFileSync(fromRoot('src/app/favicon.ico'))
    expect(favicon.readUInt16LE(0)).toBe(0)
    expect(favicon.readUInt16LE(2)).toBe(1)
    expect(favicon.readUInt16LE(4)).toBe(3)
  })
})
