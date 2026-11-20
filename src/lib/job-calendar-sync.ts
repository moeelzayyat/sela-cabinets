import { pool } from '@/lib/db'

type Queryable = Pick<typeof pool, 'query'>

export type CalendarSyncJob = {
  job_number?: string | null
  lead_id?: string | null
  start_date?: string | Date | null
  status?: string | null
  notes?: string | null
  order_details?: string | null
  crew_members?: string[] | null
}

let jobIdColumnReady: Promise<void> | null = null

async function ensureJobIdColumn(db: Queryable) {
  if (!jobIdColumnReady) {
    jobIdColumnReady = db
      .query('ALTER TABLE appointments ADD COLUMN IF NOT EXISTS job_id UUID')
      .then(() => undefined)
      .catch((error) => {
        jobIdColumnReady = null
        throw error
      })
  }
  await jobIdColumnReady
}

function appointmentNotes(job: CalendarSyncJob) {
  if (job.notes) return job.notes
  const header = `Job: ${job.job_number ?? ''}`
  return job.order_details ? `${header}\n\n${job.order_details}` : header
}

function appointmentStatus(jobStatus: string | null | undefined) {
  if (jobStatus === 'completed' || jobStatus === 'cancelled') return jobStatus
  return 'scheduled'
}

/**
 * Keeps the installation appointment on the admin calendar in step with a job:
 * creates it when the job gets a start date, updates it when the job changes,
 * and cancels it when the start date is cleared.
 */
export async function syncJobToCalendar(
  jobId: string,
  job: CalendarSyncJob,
  db: Queryable = pool
) {
  await ensureJobIdColumn(db)

  let leadName: string | undefined
  if (job.lead_id) {
    const lead = await db.query('SELECT name FROM leads WHERE id = $1', [job.lead_id])
    leadName = lead.rows[0]?.name ?? undefined
  }

  const existing = await db.query('SELECT id FROM appointments WHERE job_id = $1', [jobId])

  if (!job.start_date) {
    if (existing.rows.length > 0) {
      await cancelJobAppointments(jobId, db)
    }
    return
  }

  const title = `Installation: ${leadName || job.job_number || 'Job'}`
  const notes = appointmentNotes(job)
  const crew = job.crew_members || []

  if (existing.rows.length > 0) {
    await db.query(
      `UPDATE appointments SET
         title = $1,
         appointment_date = $2,
         notes = $3,
         crew_members = $4,
         status = $5,
         updated_at = now()
       WHERE job_id = $6`,
      [title, job.start_date, notes, crew, appointmentStatus(job.status), jobId]
    )
    return
  }

  await db.query(
    `INSERT INTO appointments (
       title, appointment_date, end_time, all_day, event_type,
       notes, crew_members, lead_id, job_id, appointment_type, status
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'scheduled')`,
    [title, job.start_date, null, true, 'installation', notes, crew, job.lead_id ?? null, jobId, 'in-home']
  )
}

export async function cancelJobAppointments(jobId: string, db: Queryable = pool) {
  await ensureJobIdColumn(db)
  await db.query(
    "UPDATE appointments SET status = 'cancelled', updated_at = now() WHERE job_id = $1",
    [jobId]
  )
}

/** Test-only: forget the cached column check. */
export function resetJobCalendarSyncCacheForTests() {
  jobIdColumnReady = null
}
