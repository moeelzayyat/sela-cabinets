import { NextRequest, NextResponse } from 'next/server'
import { getLeads, getLeadStats } from '@/lib/lead-capture'

// Simple API key check (in production, use proper auth)
const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

export async function GET(request: NextRequest) {
  try {
    // Check for API key in headers
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const source = searchParams.get('source') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const [leads, stats] = await Promise.all([
      getLeads({ status, source, limit, offset }),
      getLeadStats()
    ])

    return NextResponse.json({
      leads,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
