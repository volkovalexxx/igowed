import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVendorProfile } from '@/features/vendors/profile/server/vendorProfile.service'
import { vendorProfileRepository } from '@/features/vendors/profile/server/vendorProfile.repository'
import { auth } from '@/lib/auth'
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
  const [vendor, session] = await Promise.all([getVendorProfile(slug, vendorProfileRepository), auth()])

  if (!vendor) {
    notFound()
  }

  const viewer = {
    isAuthenticated: Boolean(session?.user?.id),
    isOwner: session?.user?.id === vendor.userId,
  }

  return <VendorProfileClient vendor={vendor} viewer={viewer} />
}
