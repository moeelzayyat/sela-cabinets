'use server'

import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { siteConfig } from '@/config/site'

const resend = new Resend(process.env.RESEND_API_KEY)
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@selacabinets.com'

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
    const budget = formData.get('budget') as string
    const style = formData.get('style') as string
    const notes = formData.get('notes') as string || ''

    // Validate required fields
    if (!name || !phone || !email || !address || !city || !zip || !timeline || !budget || !style) {
      return { success: false, error: 'Please fill in all required fields.' }
    }

    // Handle file uploads
    const photos = formData.getAll('photos') as File[]
    const photoUrls: string[] = []

    // Upload photos to Supabase Storage if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && photos.length > 0) {
      for (const photo of photos) {
        if (photo.size > 0) {
          const fileName = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const { data, error } = await supabaseAdmin.storage
            .from('estimates')
            .upload(`photos/${fileName}`, photo)

          if (!error && data) {
            const { data: urlData } = supabaseAdmin.storage
              .from('estimates')
              .getPublicUrl(`photos/${fileName}`)
            photoUrls.push(urlData.publicUrl)
          }
        }
      }
    }

    // Store in database if Supabase is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error: dbError } = await supabaseAdmin
        .from('estimate_requests')
        .insert({
          name,
          phone,
          email,
          address,
          city,
          zip,
          timeline,
          budget,
          style,
          notes,
          photo_urls: photoUrls,
          status: 'new',
        })

      if (dbError) {
        console.error('Database error:', dbError)
        // Continue anyway - we'll at least send the email
      }
    }

    // Send email notification to owner
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: `${siteConfig.name} <notifications@${process.env.RESEND_DOMAIN || 'resend.dev'}>`,
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
              <li><strong>Budget:</strong> ${budget}</li>
              <li><strong>Style Preference:</strong> ${style}</li>
            </ul>

            ${notes ? `<h3>Additional Notes</h3><p>${notes}</p>` : ''}

            ${photoUrls.length > 0 ? `
              <h3>Photos (${photoUrls.length})</h3>
              <p>View photos in Supabase Storage or use the links below:</p>
              <ul>
                ${photoUrls.map((url, i) => `<li><a href="${url}">Photo ${i + 1}</a></li>`).join('')}
              </ul>
            ` : ''}

            <hr>
            <p><small>This estimate request was submitted via the ${siteConfig.name} website.</small></p>
          `,
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Continue anyway - the data is stored
      }
    }

    // If we get here without Supabase, log the submission
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('Estimate submission (no database configured):', {
        name,
        phone,
        email,
        address,
        city,
        zip,
        timeline,
        budget,
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

