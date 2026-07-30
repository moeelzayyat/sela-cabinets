import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-charcoal-900">404</h1>
      <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal-700">
        Page Not Found
      </h2>
      <p className="mt-2 text-charcoal-600">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Contact Us</Button>
        </Link>
      </div>
    </div>
  )
}

