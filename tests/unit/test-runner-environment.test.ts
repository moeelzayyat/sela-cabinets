// @vitest-environment node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

import { describe, expect, it } from 'vitest'

describe('Vitest process isolation', () => {
  it('forces NODE_ENV=test when the parent shell is production', () => {
    const wrapper = path.join(process.cwd(), 'scripts', 'run-vitest.mjs')
    const result = spawnSync(process.execPath, [wrapper, '--probe-environment'], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' },
      encoding: 'utf8',
    })

    expect(result.status, result.stderr).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual({ NODE_ENV: 'test' })
  })
})
