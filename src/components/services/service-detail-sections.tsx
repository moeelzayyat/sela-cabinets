import type { ServicePageContent } from '@/config/service-page-content'

export function ServiceDetailSections({ content }: { content: ServicePageContent }) {
  return (
    <>
      <section className="section-padding bg-white">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Service scope</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">{content.heading}</h2>
            <div className="mt-6 space-y-4 leading-7 text-charcoal-700">
              {content.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {content.included.map((item) => (
              <article key={item.title} className="rounded-2xl border border-wood-200 bg-wood-50 p-6">
                <h3 className="font-display text-xl font-semibold text-charcoal-900">{item.title}</h3>
                <p className="mt-3 leading-7 text-charcoal-700">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-site">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-300">Step by step</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">How the service moves forward</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {content.process.map((step, index) => (
              <li key={step.title} className="border-t border-white/20 pt-5">
                <span className="text-sm font-bold text-primary-300">{index + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-charcoal-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding bg-wood-50">
        <div className="container-site grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">How the homeowner prepares</h2>
            <ul className="mt-5 space-y-3 leading-7 text-charcoal-700">
              {content.preparation.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">Timeline expectations</h2>
            <div className="mt-5 space-y-4 leading-7 text-charcoal-700">
              {content.timeline.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal-900">What is not included</h2>
            <ul className="mt-5 space-y-3 leading-7 text-charcoal-700">
              {content.exclusions.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Service FAQs</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Questions to settle before moving forward</h2>
          <div className="mt-8 divide-y divide-wood-200 border-y border-wood-200">
            {content.faqs.map((faq) => (
              <article key={faq.question} data-service-faq className="py-6">
                <h3 className="font-display text-xl font-semibold text-charcoal-900">{faq.question}</h3>
                <p className="mt-3 leading-7 text-charcoal-700">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
