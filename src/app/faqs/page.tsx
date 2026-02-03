import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CTASection } from '@/components/sections/cta-section'
import { FAQJsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet FAQs Detroit | Costs, Timeline & More | SELA',
  description: 'Answers about kitchen cabinet costs, installation timeline, in-home measurement & removal in Detroit. How much do cabinets cost? How long does install take?',
  keywords: ['kitchen cabinet cost Detroit', 'cabinet installation timeline', 'how much kitchen cabinets cost', 'cabinet removal Detroit', 'kitchen remodel FAQ'],
  openGraph: {
    title: 'Kitchen Cabinet FAQs | SELA Cabinets Detroit',
    description: 'Get answers about cabinet costs, installation & services in Detroit.',
  },
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
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {siteConfig.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
              We&apos;re here to help. Book a free consultation to discuss your project in 
              detail, or give us a call.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/book">
                <Button size="lg">Book a Consultation</Button>
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

