import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

import { describe, expect, it } from 'vitest'

describe('isolated local test server process', () => {
  it('does not forward arbitrary parent credentials to the Next.js child', () => {
    const wrapper = path.join(process.cwd(), 'scripts', 'run-isolated-test-server.mjs')
    const result = spawnSync(process.execPath, [wrapper, '--probe-environment'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: {
        ...process.env,
        AWS_SECRET_ACCESS_KEY: 'parent-cloud-secret-sentinel',
        ADMIN_SECRET: 'parent-admin-secret-sentinel',
      },
    })

    expect(result.status, result.stderr).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual({
      arbitrarySecretPresent: false,
      inheritedAdminSecretPresent: false,
      syntheticAdminSecretPresent: true,
      testDistDir: '.next-playwright',
    })
  })
})
