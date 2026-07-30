import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'

describe('unit test tooling', () => {
  it('renders an existing UI component in jsdom', () => {
    render(React.createElement(Button, null, 'Plan My Kitchen'))

    expect(screen.getByRole('button', { name: 'Plan My Kitchen' })).toBeInTheDocument()
  })
})
