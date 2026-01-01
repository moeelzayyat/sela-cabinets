'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { siteConfig } from '@/config/site'
import { submitEstimateRequest } from '@/app/actions/estimate'
import { trackEstimateSubmit, trackFormStart } from '@/lib/analytics'
import { estimateImages } from '@/config/images'

const estimateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  timeline: z.string().min(1, 'Please select a timeline'),
  budget: z.string().min(1, 'Please select a budget range'),
  style: z.string().min(1, 'Please select a style preference'),
  notes: z.string().optional(),
})

type EstimateFormData = z.infer<typeof estimateSchema>

export default function EstimatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [files, setFiles] = useState<File[]>([])
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (files.length + selectedFiles.length <= 10) {
      setFiles([...files, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: EstimateFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      files.forEach((file) => {
        formData.append('photos', file)
      })

      const result = await submitEstimateRequest(formData)

      if (result.success) {
        trackEstimateSubmit()
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
    return (
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Request Received!
            </h1>
            <p className="mt-4 text-lg text-charcoal-600">
              Thank you for your estimate request. We&apos;ve received your information 
              and will get back to you within 24 hours with a preliminary estimate.
            </p>

            <div className="mt-8 rounded-xl border border-charcoal-200 bg-charcoal-50 p-6">
              <h2 className="font-semibold text-charcoal-900">What happens next?</h2>
              <ul className="mt-4 space-y-2 text-left text-charcoal-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wood-500" />
                  We&apos;ll review your project details and photos
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wood-500" />
                  You&apos;ll receive a preliminary estimate by phone or email
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wood-500" />
                  We&apos;ll schedule an in-home measurement for precise pricing
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/book">
                <Button size="lg">Book a Consultation</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Return to Home
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-charcoal-500">
              Questions? Call us at{' '}
              <a href={siteConfig.phoneLink} className="font-semibold text-charcoal-900 hover:underline">
                {siteConfig.phoneFormatted}
              </a>
            </p>
          </div>
        </div>
      </section>
    )
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
                Get an Estimate
              </h1>
              <p className="mt-4 text-lg text-charcoal-600">
                Tell us about your kitchen cabinet project and we&apos;ll provide a 
                preliminary estimate. The more details you share, the more accurate 
                we can be.
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
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Timeline *</Label>
                    <Select onValueChange={(value) => setValue('timeline', value)}>
                      <SelectTrigger className={errors.timeline ? 'border-red-500' : ''}>
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
                    <Label>Budget Range *</Label>
                    <Select onValueChange={(value) => setValue('budget', value)}>
                      <SelectTrigger className={errors.budget ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {siteConfig.formOptions.budgets.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Style Preference *</Label>
                    <Select onValueChange={(value) => setValue('style', value)}>
                      <SelectTrigger className={errors.style ? 'border-red-500' : ''}>
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

              {/* Photo Upload */}
              <div>
                <h2 className="font-display text-xl font-semibold text-charcoal-900">
                  Photos (Optional but Helpful)
                </h2>
                <p className="mt-1 text-sm text-charcoal-600">
                  Upload photos of your current kitchen or inspiration images. Up to 10 files.
                </p>

                <div className="mt-4">
                  <label
                    htmlFor="photos"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-charcoal-300 bg-charcoal-50 p-8 transition-colors hover:border-charcoal-400"
                  >
                    <Upload className="h-10 w-10 text-charcoal-400" />
                    <span className="mt-2 text-sm font-medium text-charcoal-700">
                      Click to upload photos
                    </span>
                    <span className="text-xs text-charcoal-500">
                      PNG, JPG, HEIC up to 10MB each
                    </span>
                    <input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {files.length > 0 && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-charcoal-200 bg-white p-3"
                        >
                          <span className="truncate text-sm text-charcoal-700">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-2 text-charcoal-400 hover:text-charcoal-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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

              <p className="text-center text-sm text-charcoal-500">
                We&apos;ll respond within 24 hours. For immediate assistance, call{' '}
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

