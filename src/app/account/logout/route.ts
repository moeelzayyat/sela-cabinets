import { NextResponse } from 'next/server'
import { clearUserSession } from '@/lib/user-auth'

export async function GET(request: Request) {
  await clearUserSession()
  return NextResponse.redirect(new URL('/', request.url))
}
