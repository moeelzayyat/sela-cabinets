// @vitest-environment node

import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'

import { describe, expect, it } from 'vitest'

function portIsOpen(port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port })
    const finish = (open: boolean) => {
      socket.destroy()
      resolve(open)
    }
    socket.setTimeout(300)
    socket.once('connect', () => finish(true))
    socket.once('error', () => finish(false))
    socket.once('timeout', () => finish(false))
  })
}

async function waitForPort(port: number, expectedOpen: boolean, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if ((await portIsOpen(port)) === expectedOpen) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`port ${port} did not become ${expectedOpen ? 'open' : 'closed'}`)
}

async function waitForSuccessfulResponse(url: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs
  let lastStatus: number | undefined
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      lastStatus = response.status
      await response.text()
      if (response.ok) return
    } catch {
      // The listener can open before Next finishes preparing the route.
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(
    `timed out waiting for successful response; last status: ${lastStatus}`
  )
}

function windowsListenerPid(port: number) {
  const result = spawnSync('netstat.exe', ['-ano', '-p', 'tcp'], {
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    throw new Error(result.stderr || 'netstat failed')
  }
  const match = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) =>
      new RegExp(`^TCP\\s+127\\.0\\.0\\.1:${port}\\s+[^\\s]+\\s+LISTENING\\s+\\d+$`).test(
        line
      )
    )
  return match ? Number(match.split(/\s+/).at(-1)) : undefined
}

function windowsDescendantPids(parentPid: number) {
  const powershell = path.join(
    process.env.SystemRoot || 'C:\\Windows',
    'System32',
    'WindowsPowerShell',
    'v1.0',
    'powershell.exe'
  )
  const result = spawnSync(
    powershell,
    [
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      'Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId | ConvertTo-Json -Compress',
    ],
    { encoding: 'utf8' }
  )
  if (result.status !== 0) throw new Error(result.stderr || 'process snapshot failed')
  const parsed = JSON.parse(result.stdout || '[]')
  const processes = Array.isArray(parsed) ? parsed : [parsed]
  const descendants = new Set<number>()
  let added = true
  while (added) {
    added = false
    for (const item of processes) {
      const pid = Number(item.ProcessId)
      const candidateParent = Number(item.ParentProcessId)
      if (
        !descendants.has(pid) &&
        (candidateParent === parentPid || descendants.has(candidateParent))
      ) {
        descendants.add(pid)
        added = true
      }
    }
  }
  return Array.from(descendants)
}

function processIsAlive(pid: number) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function killWrapperOnly(child: ChildProcess) {
  if (process.platform !== 'win32') {
    expect(child.kill('SIGKILL')).toBe(true)
    return
  }
  const taskkill = path.join(
    process.env.SystemRoot || 'C:\\Windows',
    'System32',
    'taskkill.exe'
  )
  const result = spawnSync(taskkill, ['/PID', String(child.pid), '/F'], {
    encoding: 'utf8',
  })
  expect(result.status, result.stderr).toBe(0)
}

function waitForChildClose(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('wrapper did not report close after termination')),
      5_000
    )
    child.once('close', () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

describe('isolated test server lifecycle', () => {
  it(
    'owns the real Next listener in the wrapper process and releases it on wrapper-only termination',
    async () => {
      const wrapperPath = path.join(
        process.cwd(),
        'scripts',
        'run-isolated-test-server.mjs'
      )
      const wrapper = spawn(process.execPath, [wrapperPath], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      let stderr = ''
      let descendantPids: number[] = []
      wrapper.stderr?.on('data', (chunk) => {
        stderr += String(chunk)
      })

      try {
        await waitForPort(3013, true, 120_000)
        await waitForSuccessfulResponse('http://127.0.0.1:3013', 120_000)
        if (process.platform === 'win32') {
          descendantPids = windowsDescendantPids(wrapper.pid!)
          expect(windowsListenerPid(3013), stderr).toBe(wrapper.pid)
        }
        const wrapperClosed = waitForChildClose(wrapper)
        killWrapperOnly(wrapper)
        await wrapperClosed
        await waitForPort(3013, false, 10_000)
        expect(descendantPids.filter(processIsAlive)).toEqual([])
      } finally {
        if (wrapper.exitCode === null && wrapper.signalCode === null) {
          killWrapperOnly(wrapper)
        }
        const listenerPid =
          process.platform === 'win32' ? windowsListenerPid(3013) : undefined
        if (listenerPid && listenerPid !== wrapper.pid) {
          spawnSync('taskkill.exe', ['/PID', String(listenerPid), '/T', '/F'])
        }
        for (const pid of descendantPids.filter(processIsAlive)) {
          spawnSync('taskkill.exe', ['/PID', String(pid), '/T', '/F'])
        }
      }
    },
    140_000
  )
})
