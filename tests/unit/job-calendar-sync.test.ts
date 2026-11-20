import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/db', () => ({ pool: { query: vi.fn() } }))

import {
  cancelJobAppointments,
  resetJobCalendarSyncCacheForTests,
  syncJobToCalendar,
} from '@/lib/job-calendar-sync'

type Call = [string, unknown[] | undefined]

function fakeDb(options: { leadName?: string; existing?: boolean } = {}) {
  const calls: Call[] = []
  const query = vi.fn(async (sql: string, params?: unknown[]) => {
    calls.push([sql, params])
    if (sql.startsWith('SELECT name FROM leads')) {
      return { rows: options.leadName ? [{ name: options.leadName }] : [] }
    }
    if (sql.startsWith('SELECT id FROM appointments')) {
      return { rows: options.existing ? [{ id: 'appt-1' }] : [] }
    }
    return { rows: [] }
  })
  return { db: { query } as never, calls }
}

const sqlOf = (calls: Call[]) => calls.map(([sql]) => sql.replace(/\s+/g, ' ').trim())

describe('job calendar sync', () => {
  beforeEach(() => resetJobCalendarSyncCacheForTests())

  it('creates an installation appointment when a dated job has none', async () => {
    const { db, calls } = fakeDb({ leadName: 'Pat Lee' })
    await syncJobToCalendar('job-1', { lead_id: 'lead-1', job_number: 'J-100', start_date: '2026-12-01', crew_members: ['Ali'] }, db)

    const insert = calls.find(([sql]) => sql.includes('INSERT INTO appointments'))
    expect(insert).toBeDefined()
    expect(insert![1]).toEqual([
      'Installation: Pat Lee', '2026-12-01', null, true, 'installation',
      'Job: J-100', ['Ali'], 'lead-1', 'job-1', 'in-home',
    ])
  })

  it('updates the existing appointment and mirrors completed status', async () => {
    const { db, calls } = fakeDb({ existing: true })
    await syncJobToCalendar('job-1', { job_number: 'J-100', start_date: '2026-12-02', status: 'completed', order_details: 'Shaker White' }, db)

    const update = calls.find(([sql]) => sql.includes('UPDATE appointments SET') && sql.includes('title'))
    expect(update![1]).toEqual(['Installation: J-100', '2026-12-02', 'Job: J-100\n\nShaker White', [], 'completed', 'job-1'])
    expect(sqlOf(calls).some((sql) => sql.includes('INSERT'))).toBe(false)
  })

  it('treats other job statuses as scheduled', async () => {
    const { db, calls } = fakeDb({ existing: true })
    await syncJobToCalendar('job-1', { start_date: '2026-12-02', status: 'in_progress' }, db)
    const update = calls.find(([sql]) => sql.includes('title = $1'))
    expect(update![1]![4]).toBe('scheduled')
  })

  it('cancels the appointment when the start date is cleared', async () => {
    const { db, calls } = fakeDb({ existing: true })
    await syncJobToCalendar('job-1', { start_date: null }, db)
    expect(sqlOf(calls)).toContain("UPDATE appointments SET status = 'cancelled', updated_at = now() WHERE job_id = $1")
  })

  it('does nothing when an undated job has no appointment', async () => {
    const { db, calls } = fakeDb()
    await syncJobToCalendar('job-1', { start_date: null }, db)
    expect(sqlOf(calls).some((sql) => sql.startsWith('INSERT') || sql.includes("status = 'cancelled'"))).toBe(false)
  })

  it('cancels appointments for a cancelled job', async () => {
    const { db, calls } = fakeDb()
    await cancelJobAppointments('job-9', db)
    expect(calls.at(-1)).toEqual([
      "UPDATE appointments SET status = 'cancelled', updated_at = now() WHERE job_id = $1",
      ['job-9'],
    ])
  })

  it('checks the job_id column only once per process', async () => {
    const { db, calls } = fakeDb()
    await cancelJobAppointments('a', db)
    await cancelJobAppointments('b', db)
    expect(sqlOf(calls).filter((sql) => sql.startsWith('ALTER TABLE')).length).toBe(1)
  })
})
