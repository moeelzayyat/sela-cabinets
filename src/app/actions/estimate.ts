'use server'

import { Resend } from 'resend'
import { z } from 'zod'

import { siteConfig } from '@/config/site'
import { addLead } from '@/lib/lead-capture'

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'info@selatrade.com'
const NOTIFICATION_WARNING =
  'Your request was saved, but our automatic notification was delayed. Please call us if your project is urgent.'

const estimateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(30),
  email: z.string().trim().email().max(254),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(100),
  zip: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/),
  timeline: z.string().trim().min(1).max(100),
  style: z.string().trim().min(1).max(100),
  notes: z.string().trim().max(2000).default(''),
})

export interface EstimateResult {
  success: boolean
  error?: string
  warning?: string
}

function stringField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character] || character
  )
}

export async function submitEstimateRequest(
  formData: FormData
): Promise<EstimateResult> {
  const hasPhotoPayload = formData
    .getAll('photos')
    .some((value) => typeof value !== 'string' && value.size > 0)

  if (hasPhotoPayload) {
    return {
      success: false,
      error:
        'Photo uploads are not available yet. Please submit without photos or call us directly.',
    }
  }

  const parsed = estimateSchema.safeParse({
    name: stringField(formData, 'name'),
    phone: stringField(formData, 'phone'),
    email: stringField(formData, 'email'),
    address: stringField(formData, 'address'),
    city: stringField(formData, 'city'),
    zip: stringField(formData, 'zip'),
    timeline: stringField(formData, 'timeline'),
    style: stringField(formData, 'style'),
    notes: stringField(formData, 'notes'),
  })

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the required fields and try again.',
    }
  }

  const data = parsed.data

  try {
    const leadResult = await addLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      zip: data.zip,
      source: 'estimate',
      timeline: data.timeline,
      style_preference: data.style,
      notes: data.notes,
      photos: [],
    })

    if (!leadResult.success) {
      console.error('Estimate storage failed')
      return {
        success: false,
        error:
          'We could not save your request. Please try again or call us directly.',
      }
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('Estimate notification is not configured')
      return { success: true, warning: NOTIFICATION_WARNING }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const safe = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, escapeHtml(value)])
    ) as Record<keyof typeof data, string>

    try {
      const notificationResult = await resend.emails.send({
        from: `${siteConfig.name} <info@selatrade.com>`,
        to: OWNER_EMAIL,
        subject: leadResult.id
          ? `New website estimate request #${leadResult.id}`
          : 'New website estimate request',
        html: `
          <h2>New Estimate Request</h2>
          <h3>Contact Information</h3>
          <ul>
            <li><strong>Name:</strong> ${safe.name}</li>
            <li><strong>Phone:</strong> ${safe.phone}</li>
            <li><strong>Email:</strong> ${safe.email}</li>
          </ul>
          <h3>Project Address</h3>
          <p>${safe.address}<br>${safe.city}, MI ${safe.zip}</p>
          <h3>Project Details</h3>
          <ul>
            <li><strong>Timeline:</strong> ${safe.timeline}</li>
            <li><strong>Style Preference:</strong> ${safe.style}</li>
          </ul>
          ${safe.notes ? `<h3>Additional Notes</h3><p>${safe.notes}</p>` : ''}
          <hr>
          <p><small>This request was submitted through the ${siteConfig.name} website.</small></p>
        `,
      })

      if (notificationResult.error) {
        console.error('Estimate notification failed')
        return { success: true, warning: NOTIFICATION_WARNING }
      }
    } catch {
      console.error('Estimate notification failed')
      return { success: true, warning: NOTIFICATION_WARNING }
    }

    return { success: true }
  } catch {
    console.error('Estimate storage failed')
    return {
      success: false,
      error: 'We could not save your request. Please try again or call us directly.',
    }
  }
}
