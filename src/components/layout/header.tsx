'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { trackCallClick, trackBookClick } from '@/lib/analytics'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleCallClick = () => trackCallClick()
  const handleBookClick = () => trackBookClick('header')

  return (
    <header className="fixed top-0 z-50 w-full border-b border-charcoal-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-wide">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-900">
              <span className="font-display text-lg font-bold text-white">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-charcoal-900">{siteConfig.name}</span>
              <span className="hidden text-xs text-charcoal-600 sm:block">{siteConfig.location.full}</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex flex-1 justify-center">
            {siteConfig.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-charcoal-100 text-charcoal-900'
                    : 'text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex shrink-0">
            <a
              href={siteConfig.phoneLink}
              onClick={handleCallClick}
              className="hidden 2xl:flex items-center gap-2 text-sm font-semibold text-charcoal-700 transition-colors hover:text-charcoal-900 px-2"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phoneFormatted}
            </a>

            <Link href="/estimate">
              <Button variant="outline" size="sm">Request an Estimate</Button>
            </Link>
            <Link href="/book" onClick={handleBookClick}>
              <Button size="sm">Plan My Kitchen</Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-charcoal-100 lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-charcoal-100 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {siteConfig.navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'rounded-md px-4 py-3 text-base font-medium transition-colors',
                    pathname === item.href ? 'bg-charcoal-100 text-charcoal-900' : 'text-charcoal-600 hover:bg-charcoal-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 px-4">
                <Link href="/estimate" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Request an Estimate</Button>
                </Link>
                <Link href="/book" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Plan My Kitchen</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
