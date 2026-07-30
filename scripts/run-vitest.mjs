import { spawn } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const environment = { ...process.env, NODE_ENV: 'test' }
const args = process.argv.slice(2)

if (args[0] === '--probe-environment') {
  process.stdout.write(`${JSON.stringify({ NODE_ENV: environment.NODE_ENV })}\n`)
  process.exit(0)
}

const vitestCli = fileURLToPath(
  new URL('../node_modules/vitest/vitest.mjs', import.meta.url)
)
const child = spawn(process.execPath, [vitestCli, ...args], {
  env: environment,
  stdio: 'inherit',
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('error', (error) => {
  console.error(`Vitest failed to start: ${error.message}`)
  process.exit(1)
})
child.on('exit', (code, signal) => {
  if (signal && process.platform !== 'win32') {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})
