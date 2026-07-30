// @vitest-environment node

import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

interface PackageManifest {
  devDependencies?: Record<string, string>
  resolutions?: Record<string, string>
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
) as PackageManifest

describe('security dependency resolutions', () => {
  it('keeps Next transitive build dependencies above their patched minimums', () => {
    // Next 16.2.12 requests vulnerable versions. These narrow overrides are
    // intentional until Next declares patched postcss and sharp ranges.
    expect(manifest.resolutions?.['next/postcss']).toBe('8.5.18')
    expect(manifest.resolutions?.['next/sharp']).toBe('0.35.3')
    expect(manifest.resolutions?.['form-data']).toBe('4.0.6')
  })

  it('uses an ESLint 9 version supported by eslint-plugin-react', () => {
    expect(manifest.devDependencies?.eslint).toBe('^9.7.0')
  })
})
