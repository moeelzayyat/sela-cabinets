import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT e.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email
      FROM estimates e
      JOIN customers c ON e.customer_id = c.id
      ORDER BY e.created_at DESC
    `)
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching estimates:', error)
    return NextResponse.json({ error: 'Failed to fetch estimates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, project_description, estimated_budget, timeline, cabinet_style, notes } = body

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO estimates (customer_id, project_description, estimated_budget, timeline, cabinet_style, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [customer_id, project_description, estimated_budget, timeline, cabinet_style, 'pending', notes]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating estimate:', error)
    return NextResponse.json({ error: 'Failed to create estimate' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, quote_amount } = body

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE estimates SET status = $1, quote_amount = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, quote_amount, id]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating estimate:', error)
    return NextResponse.json({ error: 'Failed to update estimate' }, { status: 500 })
  }
}
