import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/contacts - List all contacts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let query = 'SELECT * FROM contacts WHERE 1=1'
    const params: any[] = []
    
    if (type) {
      params.push(type)
      query += ` AND contact_type = $${params.length}`
    }
    
    if (search) {
      params.push(`%${search}%`)
      query += ` AND (name ILIKE $${params.length} OR company ILIKE $${params.length} OR email ILIKE $${params.length})`
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)
    
    const result = await pool.query(query, params)
    
    const countResult = await pool.query('SELECT COUNT(*) FROM contacts')
    const total = parseInt(countResult.rows[0].count)
    
    return NextResponse.json({
      contacts: result.rows,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
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
    
    if (!name || !contactType) {
      return NextResponse.json({ error: 'Name and contact type are required' }, { status: 400 })
    }
    
    const result = await pool.query(`
      INSERT INTO contacts (name, company, phone, email, address, contact_type, notes, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, company, phone, email, address, contactType, notes, tags || []])
    
    return NextResponse.json({ contact: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
