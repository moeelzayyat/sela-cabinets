import { NextRequest, NextResponse } from 'next/server'
import { listUsers } from '@/lib/admin-users'
import { withAdminSession } from '@/lib/api-authorization'

export const dynamic = 'force-dynamic'

async function GETHandler(request: NextRequest) {
  if (request.nextUrl.searchParams.get('session_check') === '1') {
    return new NextResponse(null, { status: 204 })
  }
  const users = await listUsers()
  return NextResponse.json({ users })
}

export const GET = withAdminSession(GETHandler)
