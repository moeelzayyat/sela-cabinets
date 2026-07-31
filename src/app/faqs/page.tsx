import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { FAQJsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/config/site'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Planning FAQs in Detroit',
  description: 'Answers about kitchen cabinet installation, in-home measurement, design guidance, removal, and project planning in Detroit.',
  alternates: { canonical: '/faqs' },
  keywords: ['kitchen cabinet questions Detroit', 'cabinet installation timeline', 'cabinet measurement Detroit', 'cabinet removal Detroit', 'kitchen remodel FAQ'],
  ...createPageSocialMetadata({
    title: 'Kitchen Cabinet Planning FAQs in Detroit',
    description: 'Answers about kitchen cabinet installation, in-home measurement, design guidance, removal, and project planning in Detroit.',
    path: '/faqs',
  }),
}

export default function FAQsPage() {
  return (
    <>
      <FAQJsonLd faqs={siteConfig.faqs} />

      {/* Hero */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              Find answers to common questions about our kitchen cabinet services, 
              installation process, and what to expect when working with us.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto grid max-w-4xl gap-5">
              {siteConfig.faqs.map((faq, index) => (
                <article
                  key={index}
                  className="rounded-xl border border-charcoal-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="font-display text-xl font-semibold text-charcoal-900">
                    {faq.question}
                  </h2>
                  <p className="mt-3 leading-relaxed text-charcoal-600">
                    {faq.answer}
                  </p>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="section-padding wood-grain-bg">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Still Have Questions?
            </h2>
            <p className="mt-4 text-lg text-charcoal-600">
              We&apos;re here to help. Start a kitchen-planning call to discuss your project in
              detail, or give us a call.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/book">
                <Button size="lg">Plan My Kitchen</Button>
              </Link>
              <a href={siteConfig.phoneLink}>
                <Button size="lg" variant="outline">
                  Call {siteConfig.phoneFormatted}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection variant="dark" />
    </>
  )
}
