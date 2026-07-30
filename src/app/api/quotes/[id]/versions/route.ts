import { NextRequest, NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/api-authorization'
import { pool } from '@/lib/db'

// GET - Get quote versions
async function GETHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `SELECT id, version_number, subtotal, total, created_at, created_by, notes
         FROM quote_versions 
         WHERE quote_id = $1 
         ORDER BY version_number DESC`,
        [parseInt((await params).id)]
      )

      return NextResponse.json({ versions: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching quote versions:', error)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}

export const GET = withAdminSession(GETHandler)
