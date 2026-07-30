import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { withAdminSession } from '@/lib/api-authorization'

async function GETHandler() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM customers ORDER BY created_at DESC')
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

async function POSTHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, address, city, zip, notes } = body

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO customers (name, phone, email, address, city, zip, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, phone, email, address, city, zip, notes]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}

export const GET = withAdminSession(GETHandler)
export const POST = withAdminSession(POSTHandler)
