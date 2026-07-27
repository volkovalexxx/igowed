import prisma from '@/lib/prisma'
import type { AdminVendorFlag, AdminVendorRow } from '../adminVendors.types'

type VendorRow = {
  id: string
  firstName: string
  lastName: string
  username: string
  slug: string
  cities: string[]
  isPro: boolean
  isVerified: boolean
  isActive: boolean
  reviewCount: number
  rating: number
  createdAt: Date
}

function toRow(vendor: VendorRow): AdminVendorRow {
  return {
    id: vendor.id,
    name: `${vendor.firstName} ${vendor.lastName}`.trim(),
    username: vendor.username,
    slug: vendor.slug,
    city: vendor.cities[0] ?? '—',
    isPro: vendor.isPro,
    isVerified: vendor.isVerified,
    isActive: vendor.isActive,
    reviewCount: vendor.reviewCount,
    rating: vendor.rating,
    createdAt: vendor.createdAt.toISOString(),
  }
}

const FLAG_COLUMN: Record<AdminVendorFlag, 'isVerified' | 'isActive'> = {
  verified: 'isVerified',
  active: 'isActive',
}

export const adminVendorsRepository = {
  async listVendors(): Promise<AdminVendorRow[]> {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        slug: true,
        cities: true,
        isPro: true,
        isVerified: true,
        isActive: true,
        reviewCount: true,
        rating: true,
        createdAt: true,
      },
    })
    return vendors.map(toRow)
  },

  setFlag(vendorId: string, flag: AdminVendorFlag, value: boolean) {
    return prisma.vendor.updateMany({ where: { id: vendorId }, data: { [FLAG_COLUMN[flag]]: value } })
  },
}
