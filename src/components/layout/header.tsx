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

  const handleCallClick = () => {
    trackCallClick()
  }

  const handleBookClick = () => {
    trackBookClick('header')
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-charcoal-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-wide">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-900">
              <span className="font-display text-lg font-bold text-white">★</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-charcoal-900">
                {siteConfig.name}
              </span>
              <span className="hidden text-xs text-charcoal-500 sm:block">
                {siteConfig.location.full}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {siteConfig.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-charcoal-100 text-charcoal-900'
                    : 'text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/account" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-900">Client Portal</Link>
            <Link href="/account/login" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-900">Login</Link>
            <Link href="/account/register" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-900">Register</Link>
            <Link href="/account/logout" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-900">Logout</Link>

            <a
              href={siteConfig.phoneLink}
              onClick={handleCallClick}
              className="flex items-center gap-2 text-sm font-semibold text-charcoal-700 transition-colors hover:text-charcoal-900"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phoneFormatted}
            </a>
            <Link href="/estimate">
              <Button variant="outline" size="sm">
                Get an Estimate
              </Button>
            </Link>
            <Link href="/book" onClick={handleBookClick}>
              <Button size="sm">Book a Consultation</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-charcoal-100 lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
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
                    pathname === item.href
                      ? 'bg-charcoal-100 text-charcoal-900'
                      : 'text-charcoal-600 hover:bg-charcoal-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 px-4">
                <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Client Portal</Button>
                </Link>
                <Link href="/account/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/account/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Register</Button>
                </Link>
                <Link href="/account/logout" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Logout</Button>
                </Link>
                <Link href="/estimate" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Get an Estimate
                  </Button>
                </Link>
                <Link href="/book" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Book a Consultation</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

