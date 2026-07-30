import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import EstimatePage from '@/app/estimate/page'
import { EstimateSuccess } from '@/components/estimate/estimate-success'

vi.mock('@/app/actions/estimate', () => ({
  submitEstimateRequest: vi.fn(),
}))

vi.mock('@/lib/analytics', () => ({
  trackEstimateSubmit: vi.fn(),
  trackFormStart: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: ({
    priority: _priority,
    alt = '',
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    <img alt={alt} {...props} />
  ),
}))

describe('estimate form launch behavior', () => {
  it('does not offer photo uploads before durable storage exists', () => {
    render(<EstimatePage />)

    expect(screen.queryByLabelText(/upload photos/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/photos \(optional/i)).not.toBeInTheDocument()
  })

  it('shows notification delay truthfully after the request is saved', () => {
    const warning =
      'Your request was saved, but our automatic notification was delayed.'

    render(<EstimateSuccess warning={warning} />)

    expect(screen.getByRole('alert')).toHaveTextContent(warning)
    expect(screen.getByRole('heading', { name: 'Request saved' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Plan My Kitchen' })).toHaveAttribute(
      'href',
      '/book'
    )
  })
})
