import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { setUserAdminAccess } from '@/lib/admin-users'

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin?.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const isAdmin = !!body?.isAdmin
  const updated = await setUserAdminAccess(parseInt(params.id, 10), isAdmin)

  if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ user: updated })
}
