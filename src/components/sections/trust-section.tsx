import { MapPin, Ruler, Clock, Package } from 'lucide-react'

const trustItems = [
  {
    icon: MapPin,
    stat: '15+',
    title: 'Detroit-Area Cities',
    description: 'From Dearborn to Troy, Sterling Heights to Ann Arbor — we know Michigan kitchens.',
  },
  {
    icon: Ruler,
    stat: 'Free',
    title: 'In-Home Measuring',
    description: 'No guesswork. No surprises. Just cabinets that fit your space perfectly.',
  },
  {
    icon: Clock,
    stat: '1-3 Days',
    title: 'Typical Install Time',
    description: 'Most kitchens done fast. Your life back to normal quickly.',
  },
  {
    icon: Package,
    stat: 'Direct',
    title: 'Direct From Supplier',
    description: 'No middlemen. No showroom markup. Just fair pricing on quality cabinets.',
  },
]

export function TrustSection() {
  return (
    <section className="section-padding bg-charcoal-900 text-white">
      <div className="container-wide">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl">
            Why Work With SELA?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-400">
            Detroit homeowners choose us for straightforward service and quality results.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-charcoal-800 bg-charcoal-800/50 p-6 transition-all hover:border-wood-600/50 hover:bg-charcoal-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-wood-600 transition-transform group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-2xl font-bold text-wood-400">
                    {item.stat}
                  </div>
                  <h3 className="font-display text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-charcoal-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
