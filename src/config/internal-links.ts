import { allCabinetProducts } from '@/config/products-catalog'
import { siteConfig } from '@/config/site'

export const dedicatedServiceRoutes = {
  'cabinet-supply': '/services/kitchen-cabinet-supply-detroit',
  installation: '/services/kitchen-cabinet-installation-detroit',
  measurement: '/services/in-home-cabinet-measurement',
  'design-help': '/services/kitchen-cabinet-supply-detroit',
} as const

export type DedicatedServiceId = keyof typeof dedicatedServiceRoutes

export const dedicatedServices = siteConfig.services.flatMap((service) => {
  const href = dedicatedServiceRoutes[service.id as DedicatedServiceId]
  return href ? [{ ...service, href }] : []
})

export const popularCabinetStyles = allCabinetProducts.slice(0, 6)
