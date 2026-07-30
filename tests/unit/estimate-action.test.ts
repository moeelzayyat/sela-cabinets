import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  addLead: vi.fn(),
  sendEmail: vi.fn(),
}))

vi.mock('@/lib/lead-capture', () => ({
  addLead: mocks.addLead,
}))

vi.mock('resend', () => ({
  Resend: vi.fn(function MockResend() {
    return { emails: { send: mocks.sendEmail } }
  }),
}))

function validFormData() {
  const formData = new FormData()
  formData.set('name', 'Test Homeowner')
  formData.set('phone', '(313) 555-0100')
  formData.set('email', 'homeowner@example.com')
  formData.set('address', '100 Main Street')
  formData.set('city', 'Detroit')
  formData.set('zip', '48201')
  formData.set('timeline', '1-3 months')
  formData.set('style', 'Shaker')
  formData.set('notes', 'Need a measured cabinet plan')
  return formData
}

async function loadAction(options?: { resendKey?: string }) {
  vi.resetModules()
  if (options?.resendKey) {
    process.env.RESEND_API_KEY = options.resendKey
  } else {
    delete process.env.RESEND_API_KEY
  }
  process.env.OWNER_EMAIL = 'owner@example.com'
  return import('@/app/actions/estimate')
}

describe('public estimate submission', () => {
  beforeEach(() => {
    mocks.addLead.mockReset()
    mocks.sendEmail.mockReset()
    vi.restoreAllMocks()
  })

  it('rejects incomplete submissions before storage', async () => {
    const { submitEstimateRequest } = await loadAction()
    const result = await submitEstimateRequest(new FormData())

    expect(result).toEqual({
      success: false,
      error: 'Please check the required fields and try again.',
    })
    expect(mocks.addLead).not.toHaveBeenCalled()
  })

  it('rejects photo payloads while durable upload storage is unavailable', async () => {
    const { submitEstimateRequest } = await loadAction()
    const formData = validFormData()
    formData.append(
      'photos',
      new File(['not-a-real-image'], 'kitchen.jpg', { type: 'image/jpeg' })
    )

    const result = await submitEstimateRequest(formData)

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/photo uploads are not available/i)
    expect(mocks.addLead).not.toHaveBeenCalled()
  })

  it('does not report success when durable lead storage fails', async () => {
    mocks.addLead.mockResolvedValue({ success: false, error: 'database detail' })
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { submitEstimateRequest } = await loadAction({ resendKey: 'test-key' })

    const result = await submitEstimateRequest(validFormData())

    expect(result).toEqual({
      success: false,
      error: 'We could not save your request. Please try again or call us directly.',
    })
    expect(mocks.sendEmail).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalledWith('Estimate storage failed')
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('Test Homeowner')
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain('homeowner@example.com')
  })

  it('reports success only after storage and notification both succeed', async () => {
    mocks.addLead.mockResolvedValue({ success: true, id: 42 })
    mocks.sendEmail.mockResolvedValue({ data: { id: 'email-1' }, error: null })
    const { submitEstimateRequest } = await loadAction({ resendKey: 'test-key' })

    const result = await submitEstimateRequest(validFormData())

    expect(result).toEqual({ success: true })
    expect(mocks.sendEmail).toHaveBeenCalledOnce()
    const email = mocks.sendEmail.mock.calls[0][0]
    expect(email.subject).not.toContain('Test Homeowner')
  })

  it.each([
    [
      'missing configuration',
      undefined,
      undefined,
      'Estimate notification is not configured',
    ],
    [
      'provider error response',
      'test-key',
      { data: null, error: { message: 'down' } },
      'Estimate notification failed',
    ],
  ])(
    'truthfully warns after storage succeeds but notification has %s',
    async (_case, resendKey, response, expectedDiagnostic) => {
      mocks.addLead.mockResolvedValue({ success: true, id: 42 })
      if (response) mocks.sendEmail.mockResolvedValue(response)
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { submitEstimateRequest } = await loadAction({ resendKey })

      const result = await submitEstimateRequest(validFormData())

      expect(result.success).toBe(true)
      expect(result.warning).toMatch(/saved.*notification/i)
      expect(consoleError).toHaveBeenCalledWith(expectedDiagnostic)
      expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
        'homeowner@example.com'
      )
    }
  )

  it('escapes customer input before placing it in notification HTML', async () => {
    mocks.addLead.mockResolvedValue({ success: true, id: 42 })
    mocks.sendEmail.mockResolvedValue({ data: { id: 'email-1' }, error: null })
    const { submitEstimateRequest } = await loadAction({ resendKey: 'test-key' })
    const formData = validFormData()
    formData.set('notes', '<img src=x onerror=alert(1)> & details')

    await submitEstimateRequest(formData)

    const html = mocks.sendEmail.mock.calls[0][0].html
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
    expect(html).toContain('&amp; details')
  })
})
