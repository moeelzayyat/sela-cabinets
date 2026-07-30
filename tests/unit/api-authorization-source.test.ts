import fs from 'node:fs'

import { describe, expect, it } from 'vitest'

import manifest from '../security/protected-route-manifest.json'

const grouped = manifest.reduce<Record<string, typeof manifest>>((routes, entry) => {
  ;(routes[entry.sourceRouteFile] ||= []).push(entry)
  return routes
}, {})

describe('API authorization source coverage', () => {
  it('removes the legacy admin bearer key from deployable configuration', () => {
    expect(fs.readFileSync('env.example.txt', 'utf8')).not.toContain(
      'ADMIN_API_KEY'
    )
  })

  it('wraps every admin-only method with the centralized admin-session guard', () => {
    for (const [routeFile, entries] of Object.entries(grouped)) {
      const adminEntries = entries.filter(
        (entry) => entry.classification === 'admin-only'
      )
      if (!adminEntries.length) continue

      const source = fs.readFileSync(routeFile, 'utf8')
      expect(source, routeFile).toContain(
        "from '@/lib/api-authorization'"
      )
      expect(source, routeFile).not.toContain('ADMIN_API_KEY')

      for (const entry of adminEntries) {
        expect(source, `${entry.method} ${entry.routePattern}`).toContain(
          `export const ${entry.method} = withAdminSession(${entry.method}Handler)`
        )
      }
    }
  })

  it('maps every disabled-for-launch method directly to the exact 404 handler', () => {
    for (const [routeFile, entries] of Object.entries(grouped)) {
      const disabledEntries = entries.filter(
        (entry) => entry.classification === 'disabled-for-launch'
      )
      if (!disabledEntries.length) continue

      const source = fs.readFileSync(routeFile, 'utf8')
      expect(source, routeFile).toContain(
        "import { disabledForLaunch } from '@/lib/api-authorization'"
      )

      for (const entry of disabledEntries) {
        expect(source, `${entry.method} ${entry.routePattern}`).toContain(
          `export const ${entry.method} = disabledForLaunch`
        )
      }
    }
  })
})
