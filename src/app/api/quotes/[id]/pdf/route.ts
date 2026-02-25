import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { renderToStream } from '@react-pdf/renderer'
import QuotePDF from '@/components/quotes/QuotePDF'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      // Get quote
      const quoteResult = await client.query('SELECT * FROM quotes WHERE id = $1', [parseInt(params.id)])
      
      if (quoteResult.rows.length === 0) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
      }

      // Get items
      const itemsResult = await client.query(
        'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY section, sort_order',
        [parseInt(params.id)]
      )

      const quote = quoteResult.rows[0]
      const items = itemsResult.rows

      // Generate PDF
      const pdfStream = await renderToStream(<QuotePDF quote={quote} items={items} />)
      
      // Convert stream to buffer
      const chunks: Uint8Array[] = []
      for await (const chunk of pdfStream) {
        chunks.push(chunk)
      }
      const pdfBuffer = Buffer.concat(chunks)

      // Return PDF
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${quote.quote_number}.pdf"`,
          'Content-Length': String(pdfBuffer.length),
        },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
