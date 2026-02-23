/**
 * Email Notifications via Resend
 * Sends notifications when new leads come in
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface LeadEmailData {
  name: string
  phone?: string
  email?: string
  city?: string
  source: string
  notes?: string
  conversationSummary?: string
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.log('No RESEND_API_KEY configured, skipping email notification')
    return { success: false, error: 'No API key' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'SELA Cabinets <leads@selacabinets.com>',
      to: ['info@selatrade.com'],
      subject: `🔥 New Lead: ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #92400e; margin-bottom: 8px;">🥭 New Lead from ${lead.source}</h1>
          <p style="color: #666; margin-bottom: 24px;">Received ${new Date().toLocaleString()}</p>
          
          <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 16px 0; color: #1c1917;">Contact Info</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${lead.name}</p>
            ${lead.phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>` : ''}
            ${lead.email ? `<p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>` : ''}
            ${lead.city ? `<p style="margin: 8px 0;"><strong>City:</strong> ${lead.city}</p>` : ''}
          </div>
          
          ${lead.notes || lead.conversationSummary ? `
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; color: #92400e;">📝 Details</h3>
            <p style="margin: 0; white-space: pre-wrap;">${lead.notes || lead.conversationSummary}</p>
          </div>
          ` : ''}
          
          <div style="margin-top: 24px;">
            <a href="https://selacabinets.com/admin/leads" 
               style="background: #92400e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View in Admin Dashboard →
            </a>
          </div>
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e7e5e4;">
          <p style="color: #78716c; font-size: 12px;">
            This lead was captured by SELA Cabinets AI Chatbot. Respond within 30 minutes for best conversion rates!
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    console.log('Lead notification sent:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('Error sending lead notification:', error)
    return { success: false, error: String(error) }
  }
}

export async function sendChatSummaryNotification(
  sessionId: string,
  conversationSummary: string,
  contactInfo?: { name?: string; phone?: string; email?: string }
): Promise<{ success: boolean; error?: string }> {
  return sendLeadNotification({
    name: contactInfo?.name || 'Chat Visitor',
    phone: contactInfo?.phone,
    email: contactInfo?.email,
    source: 'Chatbot',
    conversationSummary,
    notes: `Session ID: ${sessionId}`,
  })
}
