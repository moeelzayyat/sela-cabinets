import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client for browser-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client with service role for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Database types for type safety
export interface EstimateRequest {
  id?: string
  created_at?: string
  name: string
  phone: string
  email: string
  address: string
  city: string
  zip: string
  timeline: string
  budget: string
  style: string
  notes?: string
  photo_urls?: string[]
  status?: 'new' | 'contacted' | 'quoted' | 'closed'
}

