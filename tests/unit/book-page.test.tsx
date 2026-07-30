import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import BookPage from '@/app/book/page'

vi.mock('@/lib/analytics', () => ({
  trackBookClick: vi.fn(),
}))

describe('book page', () => {
  it('offers the single verified SELA kitchen planning call', () => {
    const { container } = render(<BookPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Plan My Kitchen' })).toBeInTheDocument()
    expect(screen.getByText('SELA Kitchen Planning Call')).toBeInTheDocument()
    expect(screen.getByText('15 minutes')).toBeInTheDocument()

    const schedulerUrl = 'https://calendly.com/admin-selatrade/sela-kitchen-planning-call'
    expect(container.querySelector('.calendly-inline-widget')).toHaveAttribute('data-url', schedulerUrl)
    expect(screen.getByRole('link', { name: /open scheduler in new tab/i })).toHaveAttribute('href', schedulerUrl)

    expect(screen.queryByText('In-Home Measurement Visit')).not.toBeInTheDocument()
    expect(screen.queryByText('Virtual Design Planning')).not.toBeInTheDocument()
  })
})
