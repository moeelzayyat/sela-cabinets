import { NextRequest, NextResponse } from 'next/server'
import { clearUserSession } from '@/lib/user-auth'

export async function POST(request: NextRequest) {
  await clearUserSession()

  const accept = request.headers.get('accept') || ''
  if (accept.includes('application/json')) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.redirect(new URL('/', request.url))
}
