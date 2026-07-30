import { z } from 'zod'

function isPostgresUrl(value) {
  if (!value) return false
  try {
    const url = new URL(value)
    return ['postgres:', 'postgresql:'].includes(url.protocol) && Boolean(url.hostname)
  } catch {
    return false
  }
}

function usesVerifiedPostgresTls(value) {
  if (!isPostgresUrl(value)) return false
  if (
    value.trim() !== value ||
    /[\u0000-\u001f\u007f]/.test(value) ||
    value.includes('#')
  ) {
    return false
  }
  const url = new URL(value)
  const hostname = url.hostname.replace(/^\[|\]$/g, '')
  const labels = hostname.split('.')
  const validDnsHostname =
    hostname.length <= 253 &&
    /^[a-z0-9.-]+$/.test(hostname) &&
    labels.every(
      (label) =>
        label.length >= 1 &&
        label.length <= 63 &&
        /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)
    )
  if (!validDnsHostname || hostname.includes(':')) return false
  let canonicalHostname
  try {
    canonicalHostname = new URL(`http://${hostname}`).hostname
  } catch {
    return false
  }
  const isIpv4Literal = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(canonicalHostname)
  return !isIpv4Literal && url.search === '?sslmode=verify-full'
}

function isSafePublicAppUrl(value) {
  if (!value) return false
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()
    const labels = hostname.split('.')
    const isIpLiteral =
      hostname.startsWith('[') || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)
    const validDnsLabels =
      hostname.length <= 253 &&
      !hostname.endsWith('.') &&
      labels.length >= 2 &&
      labels.every(
        (label) =>
          label.length >= 1 &&
          label.length <= 63 &&
          /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
      )
    const topLevelDomain = labels[labels.length - 1] || ''
    const validTopLevelDomain =
      /^[a-z]{2,63}$/.test(topLevelDomain) ||
      /^xn--[a-z0-9-]{2,59}$/.test(topLevelDomain)
    const blockedSuffix = [
      '.alt',
      '.arpa',
      '.example',
      '.home',
      '.internal',
      '.invalid',
      '.lan',
      '.local',
      '.localhost',
      '.onion',
      '.test',
    ].some((suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix))
    const blockedHostname =
      isIpLiteral || !validDnsLabels || !validTopLevelDomain || blockedSuffix
    const canonicalOriginSyntax =
      value === url.origin || value === `${url.origin}/`
    return (
      url.protocol === 'https:' &&
      !blockedHostname &&
      canonicalOriginSyntax &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      !url.port &&
      url.pathname === '/'
    )
  } catch {
    return false
  }
}

function parseEmailAllowlist(value) {
  const emails = (value || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
  if (!emails.length) return null
  return emails.every((email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    ? emails
    : null
}

const serverEnvironmentBase = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  ADMIN_SECRET: z.string().trim().min(32),
  USER_AUTH_SECRET: z.string().trim().min(32),
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().trim().optional(),
  GOOGLE_CLIENT_SECRET: z.string().trim().optional(),
  ADMIN_GOOGLE_EMAILS: z.string().trim().optional(),
  SELA_AUTH_CONTRACT_USER_ID: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.coerce.number().int().positive().optional()
  ),
  ENABLE_CUSTOMER_PORTAL: z.literal('false').default('false'),
})

const serverEnvironmentSchema = serverEnvironmentBase
  .superRefine((environment, context) => {
    if (environment.ADMIN_SECRET === environment.USER_AUTH_SECRET) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ADMIN_SECRET'],
        message: 'Signing secrets must be distinct',
      })
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['USER_AUTH_SECRET'],
        message: 'Signing secrets must be distinct',
      })
    }

    if (
      environment.NODE_ENV === 'production' &&
      !usesVerifiedPostgresTls(environment.DATABASE_URL)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DATABASE_URL'],
        message: 'A PostgreSQL URL is required in production',
      })
    }

    if (
      environment.NODE_ENV === 'production' &&
      !isSafePublicAppUrl(environment.NEXT_PUBLIC_APP_URL)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['NEXT_PUBLIC_APP_URL'],
        message: 'A safe public HTTPS URL is required in production',
      })
    }

    if (
      environment.NODE_ENV !== 'development' &&
      environment.SELA_AUTH_CONTRACT_USER_ID !== undefined
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['SELA_AUTH_CONTRACT_USER_ID'],
        message: 'Auth contract users are development-only',
      })
    }

    if (
      Boolean(environment.GOOGLE_CLIENT_ID) !==
      Boolean(environment.GOOGLE_CLIENT_SECRET)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['GOOGLE_CLIENT_ID'],
        message: 'Google OAuth credentials must be configured together',
      })
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['GOOGLE_CLIENT_SECRET'],
        message: 'Google OAuth credentials must be configured together',
      })
    }

    if (
      environment.GOOGLE_CLIENT_ID &&
      environment.GOOGLE_CLIENT_SECRET &&
      !parseEmailAllowlist(environment.ADMIN_GOOGLE_EMAILS)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ADMIN_GOOGLE_EMAILS'],
        message: 'A valid admin email allowlist is required for Google OAuth',
      })
    }
  })
  .transform((environment) => ({
    ...environment,
    NEXT_PUBLIC_APP_URL: environment.NEXT_PUBLIC_APP_URL?.replace(/\/$/, ''),
    ADMIN_GOOGLE_EMAILS: parseEmailAllowlist(
      environment.ADMIN_GOOGLE_EMAILS
    )?.join(','),
    ENABLE_CUSTOMER_PORTAL: false,
  }))

function invalidEnvironment(variableNames) {
  const names = Array.from(new Set(variableNames)).sort()
  throw new Error(`Invalid environment variables: ${names.join(', ')}`)
}

export function parseServerEnv(input) {
  const result = serverEnvironmentSchema.safeParse(input)
  if (!result.success) {
    invalidEnvironment(
      result.error.issues.map((issue) => String(issue.path[0] || 'ENVIRONMENT'))
    )
  }
  return result.data
}
