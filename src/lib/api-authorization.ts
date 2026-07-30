import { NextRequest, NextResponse } from 'next/server'

import { serverEnv } from '@/env/server-runtime'
import { findUserById } from '@/lib/admin-users'
import { getAdminSession } from '@/lib/auth'

type RouteHandler<Arguments extends [NextRequest, ...unknown[]]> = (
  ...arguments_: Arguments
) => Response | Promise<Response>

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function hasTrustedMutationOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0].trim()
  const host = forwardedHost || request.headers.get('host')
  const forwardedProtocol = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    .trim()
  const protocol = forwardedProtocol || request.nextUrl.protocol.replace(/:$/, '')
  const requestOrigin = host ? `${protocol}://${host}` : request.nextUrl.origin
  const expectedOrigin = serverEnv.NEXT_PUBLIC_APP_URL || requestOrigin
  return origin === expectedOrigin
}

export function withAdminSession<Arguments extends [NextRequest, ...unknown[]]>(
  handler: RouteHandler<Arguments>
): RouteHandler<Arguments> {
  return async (...arguments_: Arguments) => {
    const request = arguments_[0]
    const session = await getAdminSession()

    if (
      session?.authenticated !== true ||
      !Number.isSafeInteger(session.userId) ||
      Number(session.userId) <= 0
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (
      !SAFE_METHODS.has(request.method.toUpperCase()) &&
      !hasTrustedMutationOrigin(request)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let currentAdmin
    const sessionUserId = Number(session.userId)
    if (
      serverEnv.NODE_ENV === 'development' &&
      serverEnv.SELA_AUTH_CONTRACT_USER_ID === sessionUserId
    ) {
      currentAdmin = { id: sessionUserId, is_admin: true, is_active: true }
    } else {
      try {
        currentAdmin = await findUserById(sessionUserId)
      } catch {
        return NextResponse.json(
          { error: 'Authorization unavailable' },
          { status: 503 }
        )
      }
    }

    if (!currentAdmin?.is_admin || !currentAdmin.is_active) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let response: Response
    try {
      response = await handler(...arguments_)
    } catch {
      response = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
    response.headers.set('x-sela-admin-authorization', 'accepted')
    return response
  }
}

export async function disabledForLaunch(_request: NextRequest) {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
