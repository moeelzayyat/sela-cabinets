import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/user-auth'
import { pool } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getUserSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await pool.query(
      `SELECT id, job_number, start_date, completion_date, status, phase, address, total_amount, notes, updated_at
       FROM jobs
       WHERE lower(customer_email) = lower($1)
       ORDER BY created_at DESC`,
      [session.email]
    )

    return NextResponse.json({ jobs: result.rows, user: { email: session.email, fullName: session.fullName } })
  } catch (error) {
    console.error('Error fetching account jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
