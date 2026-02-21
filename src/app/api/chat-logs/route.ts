import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://coolify:dFVc16CJwW02ogeO9pQt5rBPSE0%2FKPp6Tyjar2w6eS4%3D@coolify-db:5432/coolify?sslmode=disable',
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
    
    const client = await pool.connect()
    try {
      // Get recent chat sessions with message counts
      const sessionsResult = await client.query(`
        SELECT 
          cs.session_id,
          cs.first_message_at,
          cs.last_message_at,
          cs.message_count,
          cs.lead_captured,
          cs.contact_info,
          (
            SELECT message 
            FROM chat_messages cm 
            WHERE cm.session_id = cs.session_id 
            AND cm.sender = 'user'
            ORDER BY cm.created_at ASC 
            LIMIT 1
          ) as first_user_message
        FROM chat_sessions cs
        ORDER BY cs.last_message_at DESC
        LIMIT $1
      `, [limit])

      // Get recent messages
      const messagesResult = await client.query(`
        SELECT 
          session_id,
          message,
          sender,
          created_at
        FROM chat_messages
        ORDER BY created_at DESC
        LIMIT 500
      `)

      // Get stats
      const statsResult = await client.query(`
        SELECT 
          COUNT(DISTINCT session_id) as total_sessions,
          COUNT(*) as total_messages,
          COUNT(CASE WHEN sender = 'user' THEN 1 END) as user_messages,
          COUNT(CASE WHEN sender = 'bot' THEN 1 END) as bot_messages
        FROM chat_messages
      `)

      return NextResponse.json({
        sessions: sessionsResult.rows,
        recentMessages: messagesResult.rows,
        stats: statsResult.rows[0]
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching chat logs:', error)
    return NextResponse.json({ error: 'Failed to fetch chat logs' }, { status: 500 })
  }
}
