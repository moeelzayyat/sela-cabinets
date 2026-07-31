import { MapPin, Ruler, Clock, Package } from 'lucide-react'

const trustItems = [
  {
    icon: MapPin,
    stat: 'Area',
    title: 'Metro Detroit Planning',
    description: 'Contact SELA to confirm service availability for your Metro Detroit kitchen project.',
  },
  {
    icon: Ruler,
    stat: 'Measured',
    title: 'In-Home Measuring',
    description: 'Kitchen dimensions and existing conditions are recorded before final cabinet planning.',
  },
  {
    icon: Clock,
    stat: 'Scoped',
    title: 'Installation Planning',
    description: 'Site readiness, delivery, removal responsibilities, and installation scope are reviewed before work begins.',
  },
  {
    icon: Package,
    stat: 'Options',
    title: 'Cabinet Selection',
    description: 'Compare available construction styles, finishes, and hardware during the planning process.',
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
            Our process focuses on measured planning, cabinet selection, ordering coordination, and installation scope.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-charcoal-800 bg-charcoal-800/50 p-6 transition-all hover:border-wood-500/50 hover:bg-charcoal-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary transition-transform group-hover:scale-110">
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
