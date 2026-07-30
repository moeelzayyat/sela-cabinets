'use client'

import { Phone } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { trackCallClick } from '@/lib/analytics'

export function MobileCallButton() {
  const handleClick = () => {
    trackCallClick()
  }

  return (
    <aside
      aria-label="Quick contact"
      className="fixed bottom-4 left-4 right-24 z-50 md:hidden"
    >
      <a
        href={siteConfig.phoneLink}
        onClick={handleClick}
        className="flex items-center justify-center gap-2 rounded-full bg-charcoal-900 py-4 font-semibold text-white shadow-lg transition-all hover:bg-charcoal-800 active:scale-[0.98]"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        Call {siteConfig.phoneFormatted}
      </a>
    </aside>
  )
}
