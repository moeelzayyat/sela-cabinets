import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/contacts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    
    return NextResponse.json({ contact: result.rows[0] })
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 })
  }
}

// PUT /api/contacts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    const {
      name,
      company,
      phone,
      email,
      address,
      contactType,
      notes,
      tags
    } = data
    
    const result = await pool.query(`
      UPDATE contacts SET
        name = COALESCE($1, name),
        company = $2,
        phone = $3,
        email = $4,
        address = $5,
        contact_type = COALESCE($6, contact_type),
        notes = $7,
        tags = $8,
        updated_at = now()
      WHERE id = $9
      RETURNING *
    `, [name, company, phone, email, address, contactType, notes, tags, id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    
    return NextResponse.json({ contact: result.rows[0] })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

// DELETE /api/contacts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Contact deleted' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
