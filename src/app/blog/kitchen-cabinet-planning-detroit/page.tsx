import type { Metadata } from 'next'
import Link from 'next/link'

import { CTASection } from '@/components/sections/cta-section'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { Button } from '@/components/ui/button'

const canonicalPath = '/blog/kitchen-cabinet-planning-detroit'
const headline = 'How to Plan a Kitchen Cabinet Project in Detroit'
const description = 'Plan a Detroit kitchen cabinet project with practical guidance on measurement, cabinet construction, finishes, storage, and installation coordination.'
const publishedDate = '2026-07-30'

export const metadata: Metadata = {
  title: 'How to Plan a Kitchen Cabinet Project in Detroit',
  description: 'Plan a Detroit kitchen cabinet project with practical guidance on measurement, cabinet construction, finishes, storage, and installation coordination.',
  alternates: { canonical: '/blog/kitchen-cabinet-planning-detroit' },
  keywords: [
    'kitchen cabinet planning Detroit',
    'cabinet measurement Detroit',
    'kitchen cabinet installation planning',
    'framed and frameless cabinets',
  ],
  ...createPageSocialMetadata({
    title: 'How to Plan a Kitchen Cabinet Project in Detroit',
    description: 'Plan a Detroit kitchen cabinet project with practical guidance on measurement, cabinet construction, finishes, storage, and installation coordination.',
    path: canonicalPath,
    type: 'article',
  }),
}

export default function CabinetPlanningPost() {
  return (
    <>
      <ArticleSchema
        headline={headline}
        description={description}
        canonicalPath={canonicalPath}
        datePublished={publishedDate}
        dateModified={publishedDate}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Planning Guides', url: '/blog' },
          { name: headline, url: canonicalPath },
        ]}
      />

      <article className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-charcoal-600">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="hover:text-primary hover:underline">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" className="hover:text-primary hover:underline">Planning Guides</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Cabinet Project Planning</li>
              </ol>
            </nav>

            <header className="text-center">
              <span className="text-sm text-charcoal-600">July 30, 2026 | Planning Guide</span>
              <h1 className="mt-4 font-display text-4xl font-bold text-charcoal-900 md:text-5xl">
                {headline}
              </h1>
              <p className="mt-6 text-xl text-charcoal-600">
                A successful cabinet project starts with careful measurements, thoughtful style choices, and a clear installation plan.
              </p>
            </header>

            <div className="prose prose-lg mx-auto mt-12">
              <p>
                Kitchen cabinets shape the look, storage, workflow, and long-term function of your home. Before choosing a cabinet line or finish, understand the decisions that support a coordinated result.
              </p>

              <h2>Start With the Actual Space</h2>
              <p>
                Begin with wall lengths, ceiling height, windows, appliances, plumbing, electrical locations, and how your household uses the kitchen. In-home measurement helps replace guesswork with information tied to the real room.
              </p>

              <h2>Compare Framed and Frameless Construction</h2>
              <p>
                Framed cabinets use a face frame and often suit classic or transitional designs. Frameless cabinets provide a clean, full-access construction style. The right choice depends on your preferred look, storage priorities, layout, and selected cabinet line.
              </p>

              <h2>Plan More Than the Door Color</h2>
              <p>
                A coordinated cabinet plan also considers hardware, trim, drawer function, interior accessories, pantry storage, island details, and how the cabinets relate to counters, flooring, and lighting.
              </p>

              <div className="my-8 rounded-xl bg-charcoal-50 p-6">
                <h3 className="font-display text-xl font-bold">Details to Review</h3>
                <ul className="mt-4 space-y-2">
                  <li>Cabinet construction and door style</li>
                  <li>Finish and hardware selection</li>
                  <li>Drawer, pantry, and organizer needs</li>
                  <li>Trim, panels, and island details</li>
                  <li>Delivery, installation, and site readiness</li>
                </ul>
              </div>

              <h2>Coordinate Installation Early</h2>
              <p>
                Before installation, confirm site readiness, delivery access, workspace protection, removal responsibilities, and who coordinates adjacent work. Cabinet removal can be included in the agreed project scope. Removed cabinets remain at the property, and the customer is responsible for disposal; SELA does not haul them away.
              </p>
              <p>
                Review the available planning, measurement, selection, and installation support on the{' '}
                <Link href="/services" className="font-semibold text-primary hover:underline">
                  Review Cabinet Services
                </Link>{' '}
                page.
              </p>

              <h2>Why a Measured Estimate Matters</h2>
              <p>
                Cabinet count, layout complexity, trim, finish selections, accessories, and installation conditions all affect project scope. A measured estimate lets the plan reflect the actual room and selected options instead of a generic online assumption.
              </p>

              <div className="my-8 rounded-xl bg-wood-50 p-8">
                <h2 className="font-display text-2xl font-bold text-charcoal-900">
                  Ready to Plan Your Cabinet Project?
                </h2>
                <p className="mt-4 text-charcoal-600">
                  Start with a planning conversation about your room, cabinet needs, and next steps.
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <Link href="/book">
                    <Button size="lg" className="bg-primary hover:bg-[#184A47]">Plan My Kitchen</Button>
                  </Link>
                  <Link href="/estimate">
                    <Button size="lg" variant="outline">Start an Estimate</Button>
                  </Link>
                </div>
              </div>

              <h2>Frequently Asked Planning Questions</h2>

              <h3>Should I choose framed or frameless cabinets?</h3>
              <p>
                Compare construction, style, storage access, available finishes, and how each option fits the room. Neither type is automatically right for every kitchen.
              </p>

              <h3>What should I prepare before a planning call?</h3>
              <p>
                Share photos, rough dimensions if available, appliance information, style references, and the storage problems you want the new layout to solve. Final planning should rely on verified measurements.
              </p>

              <h3>When should installation details be discussed?</h3>
              <p>
                Discuss installation and site readiness before ordering so delivery, removal responsibilities, adjacent work, and final adjustments can be coordinated with the cabinet plan.
              </p>

              <hr className="my-12" />
              <p className="text-sm text-charcoal-600">
                Published and reviewed by SELA Cabinets on July 30, 2026. Recommendations depend on actual measurements, selected cabinets, and installation scope.
              </p>
            </div>
          </div>
        </div>
      </article>

      <CTASection variant="dark" />
    </>
  )
}
