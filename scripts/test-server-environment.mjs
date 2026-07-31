const SAFE_RUNTIME_ENV_KEYS = [
  'PATH',
  'Path',
  'PATHEXT',
  'SystemRoot',
  'SYSTEMROOT',
  'ComSpec',
  'COMSPEC',
  'TEMP',
  'TMP',
  'TMPDIR',
  'HOME',
  'USERPROFILE',
  'APPDATA',
  'LOCALAPPDATA',
  'CI',
  'TERM',
  'NO_COLOR',
  'FORCE_COLOR',
]

export function createIsolatedTestServerEnvironment(environment = process.env) {
  const isolated = {}
  for (const key of SAFE_RUNTIME_ENV_KEYS) {
    const value = environment[key]
    if (value !== undefined) isolated[key] = value
  }

  return {
    ...isolated,
    NODE_ENV: 'development',
    SELA_TEST_DIST_DIR: '.next-playwright',
    NEXT_TELEMETRY_DISABLED: '1',
    DATABASE_URL: 'postgresql://test:test@db.example.invalid:1/sela_auth_contract_no_database?sslmode=verify-full',
    DB_HOST: '127.0.0.1',
    DB_PORT: '1',
    DB_NAME: 'sela_auth_contract_no_database',
    DB_USER: '',
    DB_PASSWORD: '',
    ADMIN_SECRET: 'test-only-admin-signing-secret-000000000000',
    USER_AUTH_SECRET: 'test-only-user-signing-secret-1111111111111',
    ADMIN_EMAIL: 'admin@example.invalid',
    ADMIN_PASSWORD: 'test-only-disabled-admin-password',
    ADMIN_API_KEY: 'test-only-disabled-admin-api-key-222222222',
    SELA_AUTH_CONTRACT_USER_ID: '1',
    ADMIN_GOOGLE_EMAILS: '',
    OPENAI_API_KEY: '',
    RESEND_API_KEY: '',
    OWNER_EMAIL: 'owner@example.invalid',
    NOTION_API_KEY: '',
    NOTION_TOKEN: '',
    NOTION_DATABASE_ID: '',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    NEXT_PUBLIC_APP_URL: 'http://127.0.0.1:3013',
    NEXT_PUBLIC_GA_MEASUREMENT_ID: '',
    NEXT_PUBLIC_CALENDLY_PHONE_CONSULTATION: '',
    NEXT_PUBLIC_CALENDLY_INHOME_MEASUREMENT: '',
    NEXT_PUBLIC_CALENDLY_VIRTUAL_DESIGN: '',
    NEXT_PUBLIC_SUPABASE_URL: '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    SMTP_HOST: '',
    SMTP_USER: '',
    SMTP_PASSWORD: '',
  }
}
