/**
 * Notion CRM Integration for Lead Tracking
 * Tracks all leads from estimate requests, bookings, and contact forms
 */

import { Client } from '@notionhq/client'

interface LeadData {
  name: string
  phone: string
  email: string
  address?: string
  city?: string
  zip?: string
  source: 'estimate' | 'booking' | 'contact'
  timeline?: string
  style?: string
  notes?: string
  photos?: string[]
  appointmentType?: string
  appointmentDate?: string
}

class NotionCRM {
  private notion: Client | null = null
  private databaseId: string | null = null

  constructor() {
    if (process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID) {
      this.notion = new Client({ auth: process.env.NOTION_API_KEY })
      this.databaseId = process.env.NOTION_DATABASE_ID
    }
  }

  /**
   * Add a new lead to Notion CRM
   */
  async addLead(data: LeadData): Promise<boolean> {
    if (!this.notion || !this.databaseId) {
      console.log('Notion CRM not configured - skipping lead sync')
      return false
    }

    try {
      // Prepare properties for Notion database
      const properties: any = {
        'Name': {
          title: [{ text: { content: data.name } }]
        },
        'Email': {
          email: data.email
        },
        'Phone': {
          phone_number: data.phone
        },
        'Source': {
          select: { name: data.source }
        },
        'Status': {
          select: { name: 'New' }
        },
        'Date Added': {
          date: { start: new Date().toISOString() }
        }
      }

      // Add optional fields
      if (data.address) {
        properties['Address'] = { rich_text: [{ text: { content: data.address } }] }
      }
      if (data.city) {
        properties['City'] = { rich_text: [{ text: { content: data.city } }] }
      }
      if (data.zip) {
        properties['ZIP'] = { rich_text: [{ text: { content: data.zip } }] }
      }
      if (data.timeline) {
        properties['Timeline'] = { select: { name: data.timeline } }
      }
      if (data.style) {
        properties['Style Preference'] = { select: { name: data.style } }
      }
      if (data.notes) {
        properties['Notes'] = { rich_text: [{ text: { content: data.notes.substring(0, 2000) } }] }
      }
      if (data.appointmentType) {
        properties['Appointment Type'] = { select: { name: data.appointmentType } }
      }
      if (data.appointmentDate) {
        properties['Appointment Date'] = { date: { start: data.appointmentDate } }
      }

      // Create page in Notion database
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties,
      })

      // Add photos as page content if provided
      if (data.photos && data.photos.length > 0) {
        await this.notion.blocks.children.append({
          block_id: response.id,
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: { content: `Photos (${data.photos.length}): ${data.photos.join(', ')}` }
                  }
                ]
              }
            }
          ]
        })
      }

      console.log('Lead added to Notion CRM:', response.id)
      return true
    } catch (error) {
      console.error('Error adding lead to Notion:', error)
      return false
    }
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(pageId: string, status: string): Promise<boolean> {
    if (!this.notion) return false

    try {
      await this.notion.pages.update({
        page_id: pageId,
        properties: {
          'Status': { select: { name: status } }
        }
      })
      return true
    } catch (error) {
      console.error('Error updating lead status:', error)
      return false
    }
  }

  /**
   * Search for lead by email
   */
  async findLeadByEmail(email: string): Promise<any | null> {
    if (!this.notion || !this.databaseId) return null

    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Email',
          email: { equals: email }
        }
      })

      return response.results.length > 0 ? response.results[0] : null
    } catch (error) {
      console.error('Error searching for lead:', error)
      return null
    }
  }

  /**
   * Get all leads (with optional filters)
   */
  async getLeads(filter?: any): Promise<any[]> {
    if (!this.notion || !this.databaseId) return []

    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        ...filter
      })
      return response.results
    } catch (error) {
      console.error('Error getting leads:', error)
      return []
    }
  }
}

// Export singleton instance
export const notionCRM = new NotionCRM()

/**
 * Helper function to add lead from estimate form
 */
export async function addEstimateLead(formData: {
  name: string
  phone: string
  email: string
  address: string
  city: string
  zip: string
  timeline: string
  style: string
  notes?: string
  photos?: string[]
}) {
  return notionCRM.addLead({
    ...formData,
    source: 'estimate'
  })
}

/**
 * Helper function to add lead from booking
 */
export async function addBookingLead(formData: {
  name: string
  phone: string
  email: string
  appointmentType: string
  appointmentDate?: string
}) {
  return notionCRM.addLead({
    ...formData,
    source: 'booking'
  })
}

/**
 * Helper function to add lead from contact form
 */
export async function addContactLead(formData: {
  name: string
  phone: string
  email: string
  notes?: string
}) {
  return notionCRM.addLead({
    ...formData,
    source: 'contact'
  })
}
