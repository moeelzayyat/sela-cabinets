import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'

export const metadata: Metadata = {
  title: 'How to Plan a Premium Cabinet Project in Detroit',
  description: 'Plan a premium kitchen cabinet project in Detroit with guidance on measurement, cabinet construction, finishes, storage, installation, and consultation.',
  keywords: ['premium kitchen cabinets Detroit', 'cabinet design consultation Michigan', 'kitchen cabinet planning Detroit', 'cabinet installation planning'],
}

export default function CabinetPlanningPost() {
  return (
    <>
      <article className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <span className="text-sm text-charcoal-500">February 3, 2025 | Planning Guide</span>
              <h1 className="mt-4 font-display text-4xl font-bold text-charcoal-900 md:text-5xl">
                How to Plan a Premium Cabinet Project in Detroit
              </h1>
              <p className="mt-6 text-xl text-charcoal-600">
                A refined cabinet project starts with careful measurements, thoughtful style choices, and a clear installation plan.
              </p>
            </header>

            <div className="prose prose-lg mx-auto mt-12">
              <p>
                Kitchen cabinets shape the look, storage, workflow, and long-term feel of your home. Before choosing a cabinet line or finish, it helps to understand the decisions that create a polished result.
              </p>

              <h2>Start With the Actual Space</h2>
              <p>
                A cabinet plan should begin with the room itself: wall lengths, ceiling height, windows, appliances, plumbing, electrical locations, and how your household uses the kitchen every day. In-home measurement helps avoid guesswork and makes the final recommendation more practical.
              </p>

              <h2>Choose Construction That Matches Your Goals</h2>
              <p>
                Framed cabinets offer a classic American cabinet look with familiar profiles and traditional structure. Frameless cabinets create a more modern, full-access look with clean lines. The right choice depends on your home, preferred style, storage needs, and finish direction.
              </p>

              <h2>Think Beyond the Door Color</h2>
              <p>
                Finish selection is important, but the complete design includes hardware, trim, drawer function, interior accessories, pantry storage, island details, and how the cabinets pair with counters, flooring, and lighting.
              </p>

              <div className="my-8 rounded-xl bg-charcoal-50 p-6">
                <h3 className="font-display text-xl font-bold">Details That Shape the Project</h3>
                <ul className="mt-4 space-y-2">
                  <li>Cabinet line and construction style</li>
                  <li>Door profile and finish selection</li>
                  <li>Drawer storage, pantry storage, and specialty organizers</li>
                  <li>Trim, molding, panels, and island details</li>
                  <li>Removal, delivery, installation, and timeline needs</li>
                </ul>
              </div>

              <h2>Plan Installation Early</h2>
              <p>
                A beautiful cabinet design still needs a clean installation plan. Before the project begins, confirm what needs to be removed, how the workspace will be protected, when cabinets arrive, and what happens after installation for final adjustments.
              </p>

              <h2>Why a Personal Estimate Matters</h2>
              <p>
                Generic online numbers rarely account for the actual cabinet count, layout complexity, trim details, finish preferences, or installation conditions in your home. A measured estimate gives you a better picture of the real project scope and lets the team recommend options with confidence.
              </p>

              <div className="my-8 rounded-xl bg-wood-50 p-8">
                <h3 className="font-display text-2xl font-bold text-charcoal-900">
                  Ready to Plan Your Cabinet Project?
                </h3>
                <p className="mt-4 text-charcoal-600">
                  SELA Cabinets serves Detroit, Dearborn, Livonia, Troy, and the surrounding metro area. Start with a consultation and see cabinet samples for your home.
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <Link href="/book">
                    <Button size="lg" className="bg-primary hover:bg-[#184A47]">
                      Book a Consultation
                    </Button>
                  </Link>
                  <Link href="/estimate">
                    <Button size="lg" variant="outline">
                      Start an Estimate
                    </Button>
                  </Link>
                </div>
              </div>

              <h2>Frequently Asked Planning Questions</h2>

              <h3>Should I choose framed or frameless cabinets?</h3>
              <p>
                Framed cabinets are a strong fit for classic and transitional kitchens. Frameless cabinets often suit modern kitchens and homeowners who want a clean, full-access look.
              </p>

              <h3>Can SELA help with style decisions?</h3>
              <p>
                Yes. SELA can help you compare door profiles, finishes, hardware, and layout options so the cabinet selection feels cohesive with the rest of your home.
              </p>

              <h3>How long does cabinet installation take?</h3>
              <p>
                Installation timing depends on project scope and site conditions. The team can give you a clearer timeline after reviewing the layout and installation details.
              </p>

              <hr className="my-12" />

              <p className="text-sm text-charcoal-500">
                Last updated: February 3, 2025. Project recommendations depend on actual measurements, cabinet selections, and installation scope.
              </p>
            </div>
          </div>
        </div>
      </article>

      <CTASection variant="dark" />
    </>
  )
}
