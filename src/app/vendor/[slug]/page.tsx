import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVendorProfile } from '@/features/vendors/profile/server/vendorProfile.service'
import { vendorProfileRepository } from '@/features/vendors/profile/server/vendorProfile.repository'
import VendorProfileClient from './VendorProfileClient'

type VendorRouteProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: VendorRouteProps): Promise<Metadata> {
  const { slug } = await params
  const vendor = await getVendorProfile(slug, vendorProfileRepository)

  if (!vendor) {
    return { title: 'Подрядчик не найден | I GO WED' }
  }

  return {
    title: `${vendor.name} — ${vendor.city} | I GO WED`,
    description: vendor.bio || undefined,
  }
}

export default async function VendorProfilePage({ params }: VendorRouteProps) {
  const { slug } = await params
  const vendor = await getVendorProfile(slug, vendorProfileRepository)

  if (!vendor) {
    notFound()
  }

  return <VendorProfileClient vendor={vendor} />
}
