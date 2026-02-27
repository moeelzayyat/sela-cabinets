import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/user-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getUserSession()
  if (!session) return NextResponse.json({ authenticated: false })
  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      fullName: session.fullName || null,
      isAdmin: !!session.isAdmin,
    },
  })
}
