import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT a.*, c.name as customer_name, c.phone as customer_phone
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      ORDER BY a.appointment_date DESC
    `)
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, appointment_date, appointment_type, notes } = body

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO appointments (customer_id, appointment_date, appointment_type, status, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customer_id, appointment_date, appointment_type, 'scheduled', notes]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
