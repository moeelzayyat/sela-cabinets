import { Calendar, Ruler, PenTool, Truck } from 'lucide-react'
import { siteConfig } from '@/config/site'

const iconMap = {
  Calendar,
  Ruler,
  PenTool,
  Truck,
}

export function ProcessSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl lg:text-5xl">
            Our Simple Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
            From consultation to installation, we make getting new kitchen cabinets easy and stress-free.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {siteConfig.process.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap]
            return (
              <div
                key={step.step}
                className="group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connector line for desktop */}
                {index < siteConfig.process.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-charcoal-200 lg:block" />
                )}
                
                <div className="relative flex flex-col items-center text-center">
                  {/* Step number circle */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-charcoal-900 text-white shadow-lg transition-transform group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-wood-500 text-sm font-bold text-white">
                    {step.step}
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold text-charcoal-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

