import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const siteShellSource = readFileSync(
  resolve(process.cwd(), 'src', 'components', 'layout', 'site-shell.tsx'),
  'utf8'
)

describe('launch-safe floating controls', () => {
  it('does not mount the privacy-sensitive chat widget', () => {
    expect(siteShellSource).not.toMatch(/import\s+ChatBot/)
    expect(siteShellSource).not.toMatch(/<ChatBot\s*\/>/)
  })

  it('hides the mobile call bar on scheduler and estimate form routes', () => {
    expect(siteShellSource).toMatch(/pathname\s*===\s*['"]\/book['"]/)
    expect(siteShellSource).toMatch(/pathname\s*===\s*['"]\/estimate['"]/)
    expect(siteShellSource).toMatch(/!hideFloatingControls\s*&&\s*<MobileCallButton\s*\/>/)
  })
})
