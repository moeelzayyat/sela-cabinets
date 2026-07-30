export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
export type RouteClassification = 'public-entry' | 'admin-only' | 'disabled-for-launch'
export type RouteAudience = 'public' | 'admin' | 'customer'
export type DesiredAuth = 'none' | 'admin-session' | 'disabled'

export interface ProtectedRouteManifestEntry {
  sourceRouteFile: string
  routePattern: string
  samplePath: string
  method: HttpMethod
  audience: RouteAudience
  classification: RouteClassification
  desiredAuth: DesiredAuth
  sensitiveData: boolean
  sideEffects: boolean
  requiredInvariant?: string
}

export function routePatternForSource(sourceRouteFile: unknown): string | undefined
export function parseProtectedRouteManifest(
  input: unknown
): ReadonlyArray<Readonly<ProtectedRouteManifestEntry>>
