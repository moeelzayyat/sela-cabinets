'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CalendlyEmbed } from './calendly-embed'
import { trackBookClick } from '@/lib/analytics'

interface CalendlyButtonProps {
  url: string
  text: string
  appointmentType: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function CalendlyButton({
  url,
  text,
  appointmentType,
  variant = 'default',
  size = 'default',
  className,
}: CalendlyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const handleClick = () => {
    trackBookClick(appointmentType)
    
    // On mobile, open Calendly in a new tab for better UX
    if (isMobile) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      {/* Desktop: Modal */}
      {!isMobile ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={variant} size={size} className={className} onClick={handleClick}>
              <Calendar className="mr-2 h-4 w-4" />
              {text}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Your {appointmentType}</DialogTitle>
            </DialogHeader>
            <CalendlyEmbed url={url} appointmentType={appointmentType} />
          </DialogContent>
        </Dialog>
      ) : (
        /* Mobile: Direct link */
        <Button variant={variant} size={size} className={className} onClick={handleClick}>
          <Calendar className="mr-2 h-4 w-4" />
          {text}
        </Button>
      )}
    </>
  )
}

