import { NextRequest, NextResponse } from 'next/server'
import { setUserAdminAccess } from '@/lib/admin-users'
import { withAdminSession } from '@/lib/api-authorization'

export const dynamic = 'force-dynamic'

async function PATCHHandler(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json()
  const isAdmin = !!body?.isAdmin
  const updated = await setUserAdminAccess(parseInt((await params).id, 10), isAdmin)

  if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ user: updated })
}

export const PATCH = withAdminSession(PATCHHandler)
