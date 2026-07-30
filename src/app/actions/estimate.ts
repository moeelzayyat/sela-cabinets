'use server'

import { Resend } from 'resend'
import { siteConfig } from '@/config/site'
import { addLead } from '@/lib/lead-capture'

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'info@selatrade.com'

// Only initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface EstimateResult {
  success: boolean
  error?: string
}

export async function submitEstimateRequest(
  formData: FormData
): Promise<EstimateResult> {
  try {
    // Extract form fields
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const zip = formData.get('zip') as string
    const timeline = formData.get('timeline') as string
    const style = formData.get('style') as string
    const notes = formData.get('notes') as string || ''

    // Validate required fields
    if (!name || !phone || !email || !address || !city || !zip || !timeline || !style) {
      return { success: false, error: 'Please fill in all required fields.' }
    }

    // Handle file uploads
    const photos = formData.getAll('photos') as File[]
    const photoUrls: string[] = []

    // Store photo references (in production, upload to cloud storage)
    if (photos.length > 0) {
      for (const photo of photos) {
        if (photo.size > 0) {
          const fileName = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          photoUrls.push(`/uploads/${fileName}`)
        }
      }
    }

    // Save to database
    const leadResult = await addLead({
      name,
      phone,
      email,
      address,
      city,
      zip,
      source: 'estimate',
      timeline,
      style_preference: style,
      notes,
      photos: photoUrls
    })

    if (!leadResult.success) {
      console.error('Failed to save lead to database')
    }

    // Send email notification to owner (optional)
    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: `${siteConfig.name} <info@selatrade.com>`,
          to: OWNER_EMAIL,
          subject: `New Estimate Request from ${name}`,
          html: `
            <h2>New Estimate Request</h2>
            
            <h3>Contact Information</h3>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Email:</strong> ${email}</li>
            </ul>

            <h3>Project Address</h3>
            <p>${address}<br>${city}, MI ${zip}</p>

            <h3>Project Details</h3>
            <ul>
              <li><strong>Timeline:</strong> ${timeline}</li>
              <li><strong>Style Preference:</strong> ${style}</li>
            </ul>

            ${notes ? `<h3>Additional Notes</h3><p>${notes}</p>` : ''}

            ${photoUrls.length > 0 ? `
              <h3>Photos (${photoUrls.length})</h3>
              <p>Photos were submitted with this estimate request.</p>
            ` : ''}

            <hr>
            <p><small>This estimate request was submitted via the ${siteConfig.name} website.</small></p>
          `,
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
      }
    }

    // If no database configured, log to console
    if (!process.env.DATABASE_URL && !leadResult.success) {
      console.log('Estimate submission (database unavailable):', {
        name,
        phone,
        email,
        address,
        city,
        zip,
        timeline,
        style,
        notes,
        photoCount: photos.length,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Estimate submission error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}
