import { BadgeCheck, FileCheck2, ShieldCheck } from 'lucide-react'

import { siteConfig } from '@/config/site'

const trustFacts = [
  { label: 'License', value: siteConfig.businessFacts.license, icon: FileCheck2 },
  { label: 'Insurance', value: siteConfig.businessFacts.insured, icon: ShieldCheck },
  { label: 'Warranty', value: siteConfig.businessFacts.warranty, icon: BadgeCheck },
] as const

function isVerified(value: string) {
  return !value.startsWith('[')
}

export function VerifiedTrustStrip() {
  if (!trustFacts.every((fact) => isVerified(fact.value))) {
    return (
      <div className="mt-10 rounded-xl border border-charcoal-200 bg-white p-6 text-left">
        <p className="text-sm leading-6 text-charcoal-600">
          <strong>Questions about licensing or insurance?</strong> We&apos;re happy to discuss
          our qualifications and provide any available documentation during your consultation.
          Verified license, insurance, and warranty details will appear here only after owner confirmation.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Verified business details">
      {trustFacts.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-charcoal-200 bg-white p-5 text-left">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-charcoal-500">{label}</p>
          <p className="mt-1 font-semibold text-charcoal-900">{value}</p>
        </div>
      ))}
    </div>
  )
}
