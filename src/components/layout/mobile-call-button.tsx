'use client'

import { Phone } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { trackCallClick } from '@/lib/analytics'

export function MobileCallButton() {
  const handleClick = () => {
    trackCallClick()
  }

  return (
    <a
      href={siteConfig.phoneLink}
      onClick={handleClick}
      className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-full bg-charcoal-900 py-4 font-semibold text-white shadow-lg transition-all hover:bg-charcoal-800 active:scale-[0.98] md:hidden"
    >
      <Phone className="h-5 w-5" />
      Call {siteConfig.phoneFormatted}
    </a>
  )
}

