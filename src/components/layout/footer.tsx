import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { siteConfig } from '@/config/site'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-charcoal-100 bg-charcoal-950 text-white">
      <div className="container-wide py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                <span className="font-display text-lg font-bold text-charcoal-900">
                  S
                </span>
              </div>
              <span className="font-display text-xl font-bold">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 text-charcoal-400">
              Premium kitchen cabinets and professional installation for Detroit
              homeowners.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href={siteConfig.phoneLink}
                className="flex items-center gap-3 text-charcoal-300 transition-colors hover:text-white"
              >
                <Phone className="h-5 w-5" />
                {siteConfig.phoneFormatted}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-charcoal-300 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
                {siteConfig.email}
              </a>
              <div className="flex items-center gap-3 text-charcoal-300">
                <MapPin className="h-5 w-5" />
                {siteConfig.location.full}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {siteConfig.navigation.main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-charcoal-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold">Our Services</h3>
            <ul className="mt-4 space-y-3">
              {siteConfig.services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="text-charcoal-400 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-display text-lg font-semibold">Service Areas</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {siteConfig.serviceAreas.slice(0, 10).map((area) => (
                <li key={area} className="text-charcoal-400">
                  {area}
                </li>
              ))}
              <li className="text-charcoal-400">& more...</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-charcoal-800 pt-8 md:flex-row">
          <p className="text-sm text-charcoal-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-charcoal-500">
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link href="/faqs" className="hover:text-white">
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

