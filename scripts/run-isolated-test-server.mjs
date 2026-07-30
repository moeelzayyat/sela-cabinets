import { spawnSync } from 'node:child_process'
import { createServer } from 'node:http'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { createIsolatedTestServerEnvironment } from './test-server-environment.mjs'

const isolatedEnvironment = createIsolatedTestServerEnvironment(process.env)
const mode = process.argv[2]

if (mode === '--probe-environment') {
  const probePath = fileURLToPath(
    new URL('../tests/fixtures/report-env-presence.mjs', import.meta.url)
  )
  const result = spawnSync(process.execPath, [probePath], {
    env: isolatedEnvironment,
    encoding: 'utf8',
  })
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  process.exit(result.status ?? 1)
}

for (const key of Object.keys(process.env)) delete process.env[key]
Object.assign(process.env, isolatedEnvironment)

if (mode === '--probe-lifecycle') {
  await import('../tests/fixtures/lifecycle-child.mjs')
} else {
  const projectDirectory = fileURLToPath(new URL('..', import.meta.url))
  const next = (await import('next')).default
  const app = next({
    dev: true,
    dir: projectDirectory,
    hostname: '127.0.0.1',
    port: 3013,
  })
  await app.prepare()

  const handle = app.getRequestHandler()
  const server = createServer((request, response) => {
    void handle(request, response)
  })

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(3013, '127.0.0.1', resolve)
  })

  let shuttingDown = false
  const shutdown = async (exitCode) => {
    if (shuttingDown) return
    shuttingDown = true
    const forceExit = setTimeout(() => process.exit(exitCode || 1), 5_000)
    forceExit.unref()
    try {
      await new Promise((resolve) => server.close(resolve))
      await app.close()
      process.exit(exitCode)
    } catch (error) {
      console.error('Isolated test server shutdown failed:', error)
      process.exit(1)
    }
  }

  process.once('SIGINT', () => void shutdown(0))
  process.once('SIGTERM', () => void shutdown(0))
}
