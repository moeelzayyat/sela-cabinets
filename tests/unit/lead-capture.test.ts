import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  connect: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  pool: { connect: mocks.connect },
}))

import { addLead, type LeadData } from '@/lib/lead-capture'

const lead: LeadData = {
  name: 'Private Homeowner',
  phone: '(313) 555-0123',
  email: 'private@example.com',
  address: '100 Private Street',
  city: 'Detroit',
  zip: '48201',
  source: 'estimate',
}

describe('lead storage diagnostics', () => {
  beforeEach(() => {
    mocks.connect.mockReset()
    vi.restoreAllMocks()
  })

  it('returns a generic failure when connection acquisition fails', async () => {
    mocks.connect.mockRejectedValue(new Error('connection includes private@example.com'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(addLead(lead)).resolves.toEqual({
      success: false,
      error: 'Failed to save lead',
    })
    expect(consoleError).toHaveBeenCalledWith('Lead storage failed')
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(lead.email)
  })

  it('releases the client and does not log PII when insertion fails', async () => {
    const client = {
      query: vi.fn().mockRejectedValue(new Error(`bad value ${lead.phone}`)),
      release: vi.fn(),
    }
    mocks.connect.mockResolvedValue(client)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(addLead(lead)).resolves.toEqual({
      success: false,
      error: 'Failed to save lead',
    })
    expect(client.release).toHaveBeenCalledOnce()
    expect(consoleError).toHaveBeenCalledOnce()
    expect(consoleError).toHaveBeenCalledWith('Lead storage failed')
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(lead.phone)
  })

  it('returns the durable row ID and releases the client on success', async () => {
    const client = {
      query: vi.fn().mockResolvedValue({ rows: [{ id: 73 }] }),
      release: vi.fn(),
    }
    mocks.connect.mockResolvedValue(client)

    await expect(addLead(lead)).resolves.toEqual({ success: true, id: 73 })
    expect(client.release).toHaveBeenCalledOnce()
  })
})
