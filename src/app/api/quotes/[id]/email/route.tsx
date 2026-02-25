import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { renderToStream } from '@react-pdf/renderer'
import QuotePDF from '@/components/quotes/QuotePDF'
import { Resend } from 'resend'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

const API_KEY = process.env.ADMIN_API_KEY || 'sela-admin-2026'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' 
      }, { status: 503 })
    }

    const body = await request.json()
    const { 
      to, 
      cc, 
      bcc, 
      subject, 
      message 
    } = body

    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 })
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
      const chunks: Uint8Array[] = []
      for await (const chunk of pdfStream) {
        chunks.push(chunk)
      }
      const pdfBuffer = Buffer.concat(chunks)

      // Format currency for email
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
      }

      // Default subject
      const emailSubject = subject || `Your Quote from SELA Cabinets - ${quote.quote_number}`

      // Default message
      const emailMessage = message || `
Dear ${quote.customer_name},

Thank you for considering SELA Cabinets for your kitchen project!

Please find attached your detailed quote (${quote.quote_number}) for ${formatCurrency(quote.total)}.

**Quote Summary:**
- Quote Number: ${quote.quote_number}
- Total Amount: ${formatCurrency(quote.total)}
- Deposit Required: ${formatCurrency(quote.deposit_amount)} (${quote.deposit_percent}%)
${quote.valid_until ? `- Valid Until: ${new Date(quote.valid_until).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}

If you have any questions or would like to proceed, please don't hesitate to contact us at (313) 246-7903 or reply to this email.

We look forward to working with you!

Best regards,
The SELA Cabinets Team
(313) 246-7903
selacabinets.com
      `

      // Send email with Resend
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      const emailData: any = {
        from: 'SELA Cabinets <quotes@selacabinets.com>',
        to: Array.isArray(to) ? to : [to],
        subject: emailSubject,
        text: emailMessage,
        attachments: [
          {
            filename: `${quote.quote_number}.pdf`,
            content: pdfBuffer.toString('base64'),
          },
        ],
      }

      if (cc) emailData.cc = Array.isArray(cc) ? cc : [cc]
      if (bcc) emailData.bcc = Array.isArray(bcc) ? bcc : [bcc]

      const { data, error } = await resend.emails.send(emailData)

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 })
      }

      // Update quote status to 'sent' if it was 'draft'
      if (quote.status === 'draft') {
        await client.query(
          `UPDATE quotes SET status = 'sent', sent_at = NOW() WHERE id = $1`,
          [parseInt(params.id)]
        )
      } else {
        await client.query(`UPDATE quotes SET sent_at = NOW() WHERE id = $1`, [parseInt(params.id)])
      }

      // Log activity
      if (quote.lead_id) {
        await client.query(
          `INSERT INTO lead_activities (lead_id, activity_type, description)
           VALUES ($1, 'quote_sent', $2)`,
          [quote.lead_id, `Quote ${quote.quote_number} sent to ${Array.isArray(to) ? to.join(', ') : to}`]
        )
      }

      return NextResponse.json({ 
        success: true, 
        messageId: data?.id,
        message: 'Quote sent successfully'
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error sending quote email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
