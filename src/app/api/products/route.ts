import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const activeOnly = searchParams.get('active') === 'true'
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '200')
    
    let query = 'SELECT * FROM products WHERE 1=1'
    const params: any[] = []
    
    if (category) {
      params.push(category)
      query += ` AND category = $${params.length}`
    }
    
    if (activeOnly) {
      query += ` AND is_active = true`
    }
    
    if (search) {
      params.push(`%${search}%`)
      query += ` AND (name ILIKE $${params.length} OR sku ILIKE $${params.length} OR description ILIKE $${params.length})`
    }
    
    query += ` ORDER BY category, name LIMIT $${params.length + 1}`
    params.push(limit)
    
    const result = await pool.query(query, params)
    
    return NextResponse.json({ products: result.rows })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      name,
      sku,
      description,
      defaultPrice,
      category,
      isActive
    } = data
    
    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }
    
    const result = await pool.query(`
      INSERT INTO products (name, sku, description, default_price, category, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, sku, description, defaultPrice || 0, category, isActive !== false])
    
    return NextResponse.json({ product: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
