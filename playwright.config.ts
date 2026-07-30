import { defineConfig, devices } from '@playwright/test'

import { createIsolatedTestServerEnvironment } from './scripts/test-server-environment.mjs'

const LOCAL_TEST_URL = 'http://127.0.0.1:3013'

export function resolvePlaywrightTarget(
  requestedURL: string | undefined,
  allowExternal: boolean,
  authContract = false,
  allowDeployed = false
) {
  const rawURL = requestedURL || LOCAL_TEST_URL
  let target: URL

  try {
    target = new URL(rawURL)
  } catch {
    throw new Error('SELA_PLAYWRIGHT_BASE_URL must be a valid URL')
  }

  if (!['http:', 'https:'].includes(target.protocol)) {
    throw new Error('SELA_PLAYWRIGHT_BASE_URL must use http or https')
  }

  const isLoopback = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(
    target.hostname
  )
  if (!isLoopback && authContract) {
    throw new Error(
      'Auth contract tests require a loopback SELA_PLAYWRIGHT_BASE_URL'
    )
  }
  if (!isLoopback && !allowExternal) {
    throw new Error(
      'External Playwright targets require SELA_PLAYWRIGHT_ALLOW_EXTERNAL=true'
    )
  }
  if (!isLoopback && !allowDeployed) {
    throw new Error(
      'Deployed Playwright targets require SELA_PLAYWRIGHT_ALLOW_DEPLOYED=true'
    )
  }

  return target.toString().replace(/\/$/, '')
}

export function resolvePlaywrightEnvironment(
  environment: Record<string, string | undefined> = process.env,
  authContract = false
) {
  const externalBaseURL = environment.SELA_PLAYWRIGHT_BASE_URL
  const allowExternal = environment.SELA_PLAYWRIGHT_ALLOW_EXTERNAL === 'true'
  const allowDeployed = environment.SELA_PLAYWRIGHT_ALLOW_DEPLOYED === 'true'
  const baseURL = resolvePlaywrightTarget(
    externalBaseURL,
    allowExternal,
    authContract,
    allowDeployed
  )
  const loopbackTarget = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(
    new URL(baseURL).hostname
  )
  if (externalBaseURL && loopbackTarget && baseURL !== LOCAL_TEST_URL) {
    throw new Error(`Local tests require ${LOCAL_TEST_URL}`)
  }

  return {
    externalBaseURL,
    baseURL,
    allowExternal,
    allowDeployed,
    useLocalWebServer: baseURL === LOCAL_TEST_URL,
  }
}

export const safeLocalWebServerEnvironment = createIsolatedTestServerEnvironment

export function localWebServerCommand() {
  return 'node scripts/run-isolated-test-server.mjs'
}

const { baseURL, useLocalWebServer } = resolvePlaywrightEnvironment()

export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'security/**/*.spec.ts'],
  outputDir: 'node_modules/.cache/playwright',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: useLocalWebServer
    ? {
        command: localWebServerCommand(),
        url: baseURL,
        stdout: 'ignore',
        stderr:
          process.env.SELA_PLAYWRIGHT_VERBOSE_SERVER === 'true'
            ? 'pipe'
            : 'ignore',
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : undefined,
})
