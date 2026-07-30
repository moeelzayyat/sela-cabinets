'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileCallButton } from '@/components/layout/mobile-call-button'
import { Toaster } from '@/components/ui/toaster'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const hideFloatingControls = pathname === '/book' || pathname === '/estimate'

  if (isAdmin) {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      {!hideFloatingControls && <MobileCallButton />}
      <Toaster />
    </>
  )
}
