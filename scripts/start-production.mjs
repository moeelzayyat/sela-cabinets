import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { parseServerEnv } from '../src/env/server-schema.mjs'

function selectedEnvironment(environment) {
  return {
    NODE_ENV: environment.NODE_ENV,
    ADMIN_SECRET: environment.ADMIN_SECRET,
    USER_AUTH_SECRET: environment.USER_AUTH_SECRET,
    DATABASE_URL: environment.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: environment.NEXT_PUBLIC_APP_URL,
    GOOGLE_CLIENT_ID: environment.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: environment.GOOGLE_CLIENT_SECRET,
    ADMIN_GOOGLE_EMAILS: environment.ADMIN_GOOGLE_EMAILS,
    SELA_AUTH_CONTRACT_USER_ID: environment.SELA_AUTH_CONTRACT_USER_ID,
    ENABLE_CUSTOMER_PORTAL: environment.ENABLE_CUSTOMER_PORTAL,
  }
}

async function defaultServerLoader(serverPath) {
  await import(pathToFileURL(serverPath).href)
}

export async function startProductionServer({
  environment = process.env,
  loadServer = defaultServerLoader,
  serverPath = path.resolve('.next/standalone/server.js'),
} = {}) {
  const parsedEnvironment = parseServerEnv(selectedEnvironment(environment))
  if (parsedEnvironment.NODE_ENV !== 'production') {
    throw new Error('Invalid environment variables: NODE_ENV')
  }
  await loadServer(serverPath)
}

const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (invokedDirectly) {
  await startProductionServer()
}
