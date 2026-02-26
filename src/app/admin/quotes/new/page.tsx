'use client'

import { Suspense } from 'react'
import NewQuoteContent from './NewQuoteContent'

export default function NewQuotePage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-500">Loading quote builder...</p>
      </div>
    }>
      <NewQuoteContent />
    </Suspense>
  )
}
