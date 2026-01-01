import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

interface CTASectionProps {
  title?: string
  description?: string
  variant?: 'default' | 'dark' | 'wood'
}

export function CTASection({
  title = 'Ready to Transform Your Kitchen?',
  description = "Let's discuss your cabinet project. Book a free consultation or request an estimate today.",
  variant = 'default',
}: CTASectionProps) {
  const bgClass = {
    default: 'bg-charcoal-50',
    dark: 'bg-charcoal-900 text-white',
    wood: 'wood-grain-bg',
  }[variant]

  const textClass = variant === 'dark' ? 'text-charcoal-300' : 'text-charcoal-600'
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
              variant={variant === 'dark' ? 'white' : 'default'}
              className="w-full sm:w-auto"
            >
              Book a Consultation
            </Button>
          </Link>
          <Link href="/estimate">
            <Button
              size="lg"
              variant={variant === 'dark' ? 'outline' : 'outline'}
              className={`w-full sm:w-auto ${variant === 'dark' ? 'border-white text-white hover:bg-white hover:text-charcoal-900' : ''}`}
            >
              Get an Estimate
            </Button>
          </Link>
        </div>
        <p className={`mt-6 text-sm ${textClass}`}>
          Or call us at{' '}
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

