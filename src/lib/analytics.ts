'use client'

// Google Analytics 4 helper functions
// =====================================
// These functions provide type-safe analytics tracking.
// GA4 is loaded via the GoogleAnalytics component.

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

// Track custom events
type EventParams = {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// ============================================
// CONVERSION EVENTS
// Use these throughout the site for tracking
// ============================================

export const trackBookClick = (appointmentType?: string) => {
  event({
    action: 'book_click',
    category: 'Engagement',
    label: appointmentType || 'general',
  })
}

export const trackEstimateSubmit = () => {
  event({
    action: 'estimate_submit',
    category: 'Conversion',
    label: 'estimate_form',
  })
}

export const trackCallClick = () => {
  event({
    action: 'call_click',
    category: 'Engagement',
    label: 'phone_call',
  })
}

export const trackFormStart = (formName: string) => {
  event({
    action: 'form_start',
    category: 'Engagement',
    label: formName,
  })
}

