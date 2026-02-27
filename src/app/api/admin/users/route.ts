import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listUsers } from '@/lib/admin-users'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin?.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await listUsers()
  return NextResponse.json({ users })
}
