'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { siteConfig } from '../../config/site'
import { submitEstimateRequest } from '../actions/estimate'
import { trackEstimateSubmit, trackFormStart } from '../../lib/analytics'
import { estimateImages } from '../../config/images'
import { EstimateSuccess } from '../../components/estimate/estimate-success'

const estimateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  timeline: z.string().min(1, 'Please select a timeline'),
  style: z.string().min(1, 'Please select a style preference'),
  notes: z.string().optional(),
})

type EstimateFormData = z.infer<typeof estimateSchema>

export default function EstimatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [warning, setWarning] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
  })

  const handleFormStart = () => {
    if (!hasStarted) {
      trackFormStart('estimate')
      setHasStarted(true)
    }
  }


  const onSubmit = async (data: EstimateFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      const result = await submitEstimateRequest(formData)

      if (result.success) {
        trackEstimateSubmit()
        setWarning(result.warning)
        setIsSuccess(true)
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return <EstimateSuccess warning={warning} />
  }

  return (
    <>
      {/* Hero with side image */}
      {/* TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS */}
      <section className="bg-charcoal-50 py-16">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl">
                Request a Cabinet Estimate
              </h1>
              <p className="mt-4 text-lg text-charcoal-600">
                Tell us about your kitchen cabinet project and we&apos;ll provide a 
                preliminary estimate. The more details you share, the better we can understand your layout, style, and installation needs.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={estimateImages.banner.src}
                  alt={estimateImages.banner.alt}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFormStart} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="font-display text-xl font-semibold text-charcoal-900">
                  Contact Information
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Smith"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(313) 555-0123"
                      {...register('phone')}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="font-display text-xl font-semibold text-charcoal-900">
                  Project Address
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      {...register('address')}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-4">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Detroit"
                      {...register('city')}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      placeholder="48201"
                      {...register('zip')}
                      className={errors.zip ? 'border-red-500' : ''}
                    />
                    {errors.zip && (
                      <p className="mt-1 text-sm text-red-500">{errors.zip.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h2 className="font-display text-xl font-semibold text-charcoal-900">
                  Project Details
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="timeline">Timeline *</Label>
                    <Select onValueChange={(value) => setValue('timeline', value)}>
                      <SelectTrigger
                        id="timeline"
                        aria-label="Timeline"
                        className={errors.timeline ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {siteConfig.formOptions.timelines.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.timeline && (
                      <p className="mt-1 text-sm text-red-500">{errors.timeline.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="style">Style Preference *</Label>
                    <Select onValueChange={(value) => setValue('style', value)}>
                      <SelectTrigger
                        id="style"
                        aria-label="Style preference"
                        className={errors.style ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {siteConfig.formOptions.styles.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.style && (
                      <p className="mt-1 text-sm text-red-500">{errors.style.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Tell us more about your project... kitchen size, current cabinet condition, any specific requirements, etc."
                  {...register('notes')}
                  className="h-32"
                />
              </div>


              {/* Error message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Estimate Request'
                )}
              </Button>

              <p className="text-center text-sm text-charcoal-600">
                Your saved request will be reviewed. For immediate assistance, call{' '}
                <a href={siteConfig.phoneLink} className="font-semibold text-charcoal-900 hover:underline">
                  {siteConfig.phoneFormatted}
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
