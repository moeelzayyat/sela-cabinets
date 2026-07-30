import { defineConfig } from '@playwright/test'

import baseConfig, { resolvePlaywrightEnvironment } from './playwright.config'

resolvePlaywrightEnvironment(process.env, true)

export default defineConfig({
  ...baseConfig,
  fullyParallel: false,
  workers: 1,
})
