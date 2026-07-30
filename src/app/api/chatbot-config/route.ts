import { NextRequest, NextResponse } from 'next/server'
import { withAdminSession } from '@/lib/api-authorization'
import { pool } from '@/lib/db'

// GET - Retrieve chatbot configuration
async function GETHandler(request: NextRequest) {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT key, value, updated_at FROM chatbot_config ORDER BY key'
      )
      
      const config: Record<string, { value: string; updated_at: string }> = {}
      result.rows.forEach(row => {
        config[row.key] = {
          value: row.value,
          updated_at: row.updated_at
        }
      })

      return NextResponse.json({ config })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching chatbot config:', error)
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

// POST - Update chatbot configuration
async function POSTHandler(request: NextRequest) {
  try {
    const { key, value } = await request.json()

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query(
        `INSERT INTO chatbot_config (key, value, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key)
         DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      )

      return NextResponse.json({ success: true, message: 'Configuration updated' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating chatbot config:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}

export const GET = withAdminSession(GETHandler)
export const POST = withAdminSession(POSTHandler)
