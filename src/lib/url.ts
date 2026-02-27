export function getAppBaseUrl(origin?: string) {
  const envUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim()
  if (envUrl && !envUrl.includes('0.0.0.0') && !envUrl.includes('localhost')) {
    return envUrl
  }
  if (origin && !origin.includes('0.0.0.0')) return origin
  return 'https://selacabinets.com'
}
