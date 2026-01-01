import { MapPin, Users, Ruler, Clock } from 'lucide-react'

const trustItems = [
  {
    icon: MapPin,
    title: 'Serving Detroit',
    description: 'Proudly serving Detroit and surrounding communities throughout metro Michigan.',
  },
  {
    icon: Users,
    title: 'Experienced Team',
    description: 'Our skilled installers bring years of cabinet installation expertise to every project.',
  },
  {
    icon: Ruler,
    title: 'Precise Measurement',
    description: 'Complimentary in-home measurement ensures your cabinets fit perfectly.',
  },
  {
    icon: Clock,
    title: 'Reliable Service',
    description: 'We respect your time with clear communication and on-schedule completion.',
  },
]

export function TrustSection() {
  return (
    <section className="section-padding bg-charcoal-900 text-white">
      <div className="container-wide">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl">
            Why Detroit Homeowners Choose Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-300">
            We&apos;re committed to making your cabinet project a success from start to finish.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className="text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-wood-600">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-charcoal-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

