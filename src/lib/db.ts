import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export { pool }

// Database types for type safety
export interface Customer {
  id?: string
  created_at?: string
  updated_at?: string
  name: string
  email?: string
  phone: string
  address?: string
  city?: string
  zip?: string
  notes?: string
}

export interface Appointment {
  id?: string
  created_at?: string
  updated_at?: string
  customer_id: string
  appointment_date: string
  appointment_type: 'phone' | 'in-home' | 'virtual'
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
}

export interface Estimate {
  id?: string
  created_at?: string
  updated_at?: string
  customer_id: string
  project_description?: string
  estimated_budget?: number
  timeline?: string
  cabinet_style?: string
  status?: 'pending' | 'quoted' | 'approved' | 'completed'
  quote_amount?: number
  notes?: string
}

export interface Job {
  id?: string
  created_at?: string
  updated_at?: string
  customer_id: string
  estimate_id?: string
  job_number?: string
  start_date?: string
  completion_date?: string
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  total_amount?: number
  notes?: string
}
