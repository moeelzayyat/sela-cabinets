import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

interface CTASectionProps {
  title?: string
  description?: string
  variant?: 'default' | 'dark' | 'wood'
}

export function CTASection({
  title = 'See What Your Kitchen Could Look Like',
  description = 'Book a free consultation. Get a real quote. No obligation.',
  variant = 'default',
}: CTASectionProps) {
  const bgClass = {
    default: 'bg-charcoal-50',
    dark: 'bg-charcoal-900 text-white',
    wood: 'wood-grain-bg',
  }[variant]

  const textClass = variant === 'dark' ? 'text-charcoal-400' : 'text-charcoal-600'
  const titleClass = variant === 'dark' ? 'text-white' : 'text-charcoal-900'

  return (
    <section className={`section-padding ${bgClass}`}>
      <div className="container-wide text-center">
        <h2 className={`font-display text-3xl font-bold md:text-4xl lg:text-5xl ${titleClass}`}>
          {title}
        </h2>
        <p className={`mx-auto mt-4 max-w-2xl text-lg ${textClass}`}>
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/book">
            <Button
              size="lg"
              variant={variant === 'dark' ? 'default' : 'default'}
              className={`w-full sm:w-auto ${variant === 'dark' ? 'bg-wood-600 hover:bg-wood-500' : ''}`}
            >
              Book Free Consult
            </Button>
          </Link>
          <Link href="/estimate">
            <Button
              size="lg"
              variant="outline"
              className={`w-full sm:w-auto ${variant === 'dark' ? 'border-white/50 text-white hover:bg-white hover:text-charcoal-900' : ''}`}
            >
              Get an Estimate
            </Button>
          </Link>
        </div>
        <p className={`mt-6 text-sm ${textClass}`}>
          Questions? Text or call{' '}
          <a
            href={siteConfig.phoneLink}
            className={`font-semibold underline-offset-2 hover:underline ${variant === 'dark' ? 'text-white' : 'text-charcoal-900'}`}
          >
            {siteConfig.phoneFormatted}
          </a>
        </p>
      </div>
    </section>
  )
}
