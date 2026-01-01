'use client'

import { useEffect } from 'react'
import { trackBookClick } from '@/lib/analytics'

interface CalendlyEmbedProps {
  url: string
  appointmentType?: string
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string
        parentElement: HTMLElement
        prefill?: Record<string, unknown>
        utm?: Record<string, string>
      }) => void
    }
  }
}

export function CalendlyEmbed({ url, appointmentType }: CalendlyEmbedProps) {
  useEffect(() => {
    // Track when embed loads
    if (appointmentType) {
      trackBookClick(appointmentType)
    }

    // Load Calendly widget script if not already loaded
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      )
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [appointmentType])

  return (
    <div
      className="calendly-inline-widget w-full rounded-xl bg-white"
      data-url={url}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}

