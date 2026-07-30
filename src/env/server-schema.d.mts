export type ServerEnvironmentInput = Record<string, string | undefined>

export interface ServerEnvironment {
  NODE_ENV: 'development' | 'test' | 'production'
  ADMIN_SECRET: string
  USER_AUTH_SECRET: string
  DATABASE_URL?: string
  NEXT_PUBLIC_APP_URL?: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  ADMIN_GOOGLE_EMAILS?: string
  SELA_AUTH_CONTRACT_USER_ID?: number
  ENABLE_CUSTOMER_PORTAL: false
}

export function parseServerEnv(
  input: ServerEnvironmentInput
): ServerEnvironment
