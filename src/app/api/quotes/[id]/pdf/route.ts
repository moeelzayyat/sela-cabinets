import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import PDFDocument from 'pdfkit'

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

      // Generate PDF using PDFKit
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk) => chunks.push(chunk))

      const pdfPromise = new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)))
      })

      // Helper functions
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
      }

      const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        return new Date(dateStr).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        })
      }

      // Header
      doc.fontSize(24).fillColor('#F59E0B').text('SELA Cabinets', 50, 50)
      doc.fontSize(10).fillColor('#64748B')
        .text('Premium Kitchen Cabinets at Wholesale Prices', 50, 80)
        .text('Detroit, MI Metro Area', 50, 92)
      
      doc.fontSize(10).fillColor('#64748B')
        .text('(313) 246-7903', 400, 50)
        .text('info@selacabinets.com', 400, 62)
        .text('selacabinets.com', 400, 74)

      // Quote title
      doc.moveDown(3)
      doc.fontSize(28).fillColor('#F59E0B').text('QUOTE', 50, 130)
      doc.fontSize(12).fillColor('#334155')
        .text(quote.quote_number, 50, 165)
        .text(`Date: ${formatDate(quote.created_at)}`, 50, 180)
      if (quote.valid_until) {
        doc.text(`Valid Until: ${formatDate(quote.valid_until)}`, 50, 195)
      }

      // Status badge
      const statusColors: Record<string, string> = {
        draft: '#64748B', sent: '#2563EB', accepted: '#059669', declined: '#DC2626'
      }
      doc.fontSize(10).fillColor(statusColors[quote.status] || '#64748B')
        .text(quote.status.toUpperCase(), 450, 165)

      // Customer info
      doc.moveDown(3)
      doc.fontSize(10).fillColor('#64748B').text('BILL TO:', 50, 230)
      doc.fontSize(12).fillColor('#1E293B')
        .text(quote.customer_name, 50, 245)
      if (quote.customer_phone) {
        doc.fontSize(10).fillColor('#334155').text(quote.customer_phone, 50, 262)
      }
      if (quote.customer_email) {
        doc.text(quote.customer_email, 50, 275)
      }
      if (quote.customer_address) {
        doc.text(quote.customer_address, 50, 288)
      }

      // Line items table header
      let y = 340
      doc.rect(50, y - 5, 495, 25).fill('#1E293B')
      doc.fontSize(9).fillColor('#FFFFFF')
        .text('Description', 60, y + 3, { width: 220 })
        .text('Qty', 280, y + 3, { width: 40, align: 'center' })
        .text('Price', 330, y + 3, { width: 70, align: 'right' })
        .text('Disc', 410, y + 3, { width: 40, align: 'center' })
        .text('Total', 490, y + 3, { width: 50, align: 'right' })

      y += 30
      doc.fillColor('#334155')

      // Group items by section
      const sectionLabels: Record<string, string> = {
        cabinets: 'Cabinets', hardware: 'Hardware', labor: 'Labor',
        countertops: 'Countertops', delivery: 'Delivery', other: 'Other'
      }
      const sectionOrder = ['cabinets', 'hardware', 'labor', 'countertops', 'delivery', 'other']

      const groupedItems = items.reduce((acc, item) => {
        const section = item.section || 'other'
        if (!acc[section]) acc[section] = []
        acc[section].push(item)
        return acc
      }, {} as Record<string, any[]>)

      for (const section of sectionOrder) {
        const sectionItems = groupedItems[section]
        if (!sectionItems || sectionItems.length === 0) continue

        // Section header
        doc.rect(50, y - 3, 495, 18).fill('#F1F5F9')
        doc.fontSize(8).fillColor('#475569')
          .text(sectionLabels[section] || section, 60, y + 1)
        y += 20

        for (const item of sectionItems) {
          doc.fontSize(9).fillColor('#334155')
            .text(item.description?.substring(0, 50) || '', 60, y, { width: 220 })
            .text(String(item.quantity || 1), 280, y, { width: 40, align: 'center' })
            .text(formatCurrency(item.unit_price || 0), 330, y, { width: 70, align: 'right' })
            .text(`${item.discount_percent || 0}%`, 410, y, { width: 40, align: 'center' })
            .text(formatCurrency(item.line_total || 0), 490, y, { width: 50, align: 'right' })
          y += 18
        }
      }

      // Totals
      y += 20
      const totalsX = 350
      doc.fontSize(10).fillColor('#334155')
        .text('Subtotal:', totalsX, y, { width: 100, align: 'right' })
        .text(formatCurrency(quote.subtotal), 490, y, { width: 50, align: 'right' })
      y += 18

      if (quote.discount_percent > 0) {
        doc.fillColor('#DC2626')
          .text(`Discount (${quote.discount_percent}%):`, totalsX, y, { width: 100, align: 'right' })
          .text(`-${formatCurrency(quote.discount_amount)}`, 490, y, { width: 50, align: 'right' })
        y += 18
      }

      doc.fillColor('#334155')
        .text(`Tax (${quote.tax_rate}%):`, totalsX, y, { width: 100, align: 'right' })
        .text(formatCurrency(quote.tax_amount), 490, y, { width: 50, align: 'right' })
      y += 25

      // Total row
      doc.rect(340, y - 5, 205, 25).fill('#F59E0B')
      doc.fontSize(12).fillColor('#FFFFFF')
        .text('Total:', totalsX, y + 2, { width: 100, align: 'right' })
        .text(formatCurrency(quote.total), 490, y + 2, { width: 50, align: 'right' })
      y += 35

      // Deposit
      doc.rect(340, y - 5, 205, 20).fill('#D1FAE5')
      doc.fontSize(10).fillColor('#059669')
        .text(`Deposit Required (${quote.deposit_percent}%):`, totalsX - 10, y + 2, { width: 110, align: 'right' })
        .text(formatCurrency(quote.deposit_amount), 490, y + 2, { width: 50, align: 'right' })
      y += 40

      // Terms
      if (quote.terms) {
        doc.rect(50, y, 495, 80).fill('#F8FAFC')
        doc.fontSize(9).fillColor('#475569')
          .text('Terms & Conditions:', 60, y + 10)
          .fontSize(8).fillColor('#64748B')
          .text(quote.terms, 60, y + 25, { width: 470 })
      }

      // Signature lines
      y = 720
      doc.moveTo(50, y).lineTo(200, y).stroke('#CBD5E1')
      doc.moveTo(300, y).lineTo(450, y).stroke('#CBD5E1')
      doc.fontSize(8).fillColor('#64748B')
        .text('Customer Signature', 50, y + 5)
        .text('Date', 300, y + 5)

      // Footer
      doc.fontSize(8).fillColor('#94A3B8')
        .text('Thank you for choosing SELA Cabinets! • (313) 246-7903 • selacabinets.com', 50, 780, { align: 'center', width: 495 })

      doc.end()

      const pdfBuffer = await pdfPromise

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
    return NextResponse.json({ error: 'Failed to generate PDF', details: String(error) }, { status: 500 })
  }
}
