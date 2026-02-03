import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'

export const metadata: Metadata = {
  title: 'How Much Do Kitchen Cabinets Cost in Detroit? (2025 Pricing Guide)',
  description: 'Real kitchen cabinet costs for Detroit homeowners in 2025. From budget to premium options. Get accurate pricing for your kitchen remodel.',
  keywords: ['kitchen cabinet cost Detroit', 'cabinet installation price Michigan', 'how much kitchen cabinets cost', 'Detroit kitchen remodel cost', 'Aline cabinets pricing'],
}

export default function CabinetCostsPost() {
  return (
    <>
      <article className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <span className="text-sm text-charcoal-500">February 3, 2025 · Pricing Guide</span>
              <h1 className="mt-4 font-display text-4xl font-bold text-charcoal-900 md:text-5xl">
                How Much Do Kitchen Cabinets Cost in Detroit? (2025 Guide)
              </h1>
              <p className="mt-6 text-xl text-charcoal-600">
                Real numbers for kitchen cabinet costs in the Detroit metro area. From budget-friendly 
                options to premium installations.
              </p>
            </header>

            <div className="prose prose-lg mx-auto mt-12">
              <p>
                If you&apos;re planning a kitchen remodel in Detroit, understanding cabinet costs is essential 
                for budgeting. Cabinetry typically represents 30-40% of your total kitchen renovation budget, 
                making it one of the biggest investments you&apos;ll make.
              </p>

              <h2>Average Kitchen Cabinet Costs in Detroit (2025)</h2>
              
              <p>Based on our work with Detroit-area homeowners, here are realistic price ranges you can expect:</p>

              <div className="my-8 rounded-xl bg-charcoal-50 p-6">
                <h3 className="font-display text-xl font-bold">Small Kitchen (8x10 or less)</h3>
                <ul className="mt-4 space-y-2">
                  <li><strong>Budget Options:</strong> $3,000 - $6,000</li>
                  <li><strong>Mid-Range:</strong> $6,000 - $10,000</li>
                  <li><strong>Premium:</strong> $10,000 - $15,000+</li>
                </ul>
              </div>

              <div className="my-8 rounded-xl bg-charcoal-50 p-6">
                <h3 className="font-display text-xl font-bold">Medium Kitchen (10x10)</h3>
                <ul className="mt-4 space-y-2">
                  <li><strong>Budget Options:</strong> $5,000 - $8,000</li>
                  <li><strong>Mid-Range:</strong> $8,000 - $15,000</li>
                  <li><strong>Premium:</strong> $15,000 - $25,000+</li>
                </ul>
              </div>

              <div className="my-8 rounded-xl bg-charcoal-50 p-6">
                <h3 className="font-display text-xl font-bold">Large Kitchen (12x12 or more)</h3>
                <ul className="mt-4 space-y-2">
                  <li><strong>Budget Options:</strong> $7,000 - $12,000</li>
                  <li><strong>Mid-Range:</strong> $12,000 - $20,000</li>
                  <li><strong>Premium:</strong> $20,000 - $35,000+</li>
                </ul>
              </div>

              <h2>What Affects Cabinet Costs?</h2>

              <p>Several factors influence your final kitchen cabinet price:</p>

              <h3>1. Cabinet Material and Construction</h3>
              <p>
                <strong>Particle board with melamine:</strong> Most affordable option, commonly used in 
                frameless European-style cabinets. Prices start around $100-150 per linear foot.
              </p>
              <p>
                <strong>Plywood construction:</strong> More durable and moisture-resistant. Expect to pay 
                $150-250 per linear foot for quality plywood box cabinets with solid wood doors.
              </p>
              <p>
                <strong>Solid wood:</strong> Premium all-wood cabinets. $250-400+ per linear foot depending 
                on wood species and door style.
              </p>

              <h3>2. Door Style</h3>
              <p><strong>Shaker:</strong> The most popular and cost-effective style. Works in both traditional 
              and contemporary kitchens. Typically adds $0-20 per door vs. flat panel.</p>
              
              <p><strong>Flat Panel (Slab):</strong> Simple, modern look. Often the most affordable option 
              for contemporary kitchens.</p>
              
              <p><strong>Raised Panel:</strong> More detailed, traditional look. Can add $30-50 per door 
              due to additional machining.</p>

              <h3>3. Finish and Color</h3>
              <p><strong>Standard painted finishes</strong> (white, gray, cream) are typically included 
              in base pricing.</p>
              
              <p><strong>Stained wood finishes</strong> may add $10-30 per door depending on the wood species.</p>
              
              <p><strong>Specialty finishes</strong> like glazes, distressing, or high-gloss can add 20-40% 
              to the total cost.</p>

              <h2>Additional Costs to Consider</h2>

              <p>Beyond the cabinets themselves, factor in these additional expenses:</p>

              <ul>
                <li><strong>Installation:</strong> $1,500 - $4,000 depending on kitchen size and complexity</li>
                <li><strong>Removal of old cabinets:</strong> $500 - $1,500</li>
                <li><strong>Hardware (handles, knobs):</strong> $200 - $800</li>
                <li><strong>Crown molding & trim:</strong> $300 - $1,000</li>
                <li><strong>Cabinet interior upgrades:</strong> Pull-out shelves, lazy susans, etc. ($50-200 each)</li>
              </ul>

              <h2>How to Get an Accurate Quote in Detroit</h2>

              <p>
                The best way to get an accurate price for your kitchen is to have a professional measure 
                your space and understand your needs. At SELA Cabinets, we offer:
              </p>

              <ul>
                <li>Free in-home measurements for Detroit-area homeowners</li>
                <li>Detailed quotes within 24-48 hours</li>
                <li>No-obligation consultations where we bring samples to your home</li>
                <li>Transparent pricing with no hidden fees</li>
              </ul>

              <div className="my-8 rounded-xl bg-wood-50 p-8">
                <h3 className="font-display text-2xl font-bold text-charcoal-900">
                  Ready to Get Your Kitchen Cabinet Quote?
                </h3>
                <p className="mt-4 text-charcoal-600">
                  We serve Detroit, Dearborn, Livonia, Troy, and throughout the metro area. 
                  Book a free consultation and see real cabinet samples in your home.
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                  <Link href="/book">
                    <Button size="lg" className="bg-wood-600 hover:bg-wood-500">
                      Book Free Consultation
                    </Button>
                  </Link>
                  <Link href="/estimate">
                    <Button size="lg" variant="outline">
                      Get a Quick Estimate
                    </Button>
                  </Link>
                </div>
              </div>

              <h2>Frequently Asked Questions About Cabinet Costs</h2>

              <h3>Are more expensive cabinets worth it?</h3>
              <p>
                Higher-quality cabinets typically offer better construction (plywood boxes vs. particle board), 
                soft-close features, and more durable finishes. For a kitchen you&apos;ll use daily for 10+ years, 
                investing in quality often pays off in durability and satisfaction.
              </p>

              <h3>Can I save money by installing cabinets myself?</h3>
              <p>
                DIY installation can save $1,500-4,000, but professional installation ensures proper fit, 
                level cabinets, and warranty coverage. For most homeowners, professional installation is 
                worth the investment.
              </p>

              <h3>How long does cabinet installation take?</h3>
              <p>
                Most standard kitchen installations take 1-3 days. Larger kitchens or those with complex 
                features (islands, corner cabinets, etc.) may take 3-5 days.
              </p>

              <hr className="my-12" />

              <p className="text-sm text-charcoal-500">
                Last updated: February 3, 2025. Prices are estimates based on Detroit metro area market rates 
                and may vary based on specific project requirements.
              </p>
            </div>
          </div>
        </div>
      </article>

      <CTASection variant="dark" />
    </>
  )
}
