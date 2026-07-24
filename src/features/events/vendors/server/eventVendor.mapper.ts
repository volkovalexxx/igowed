import type { EventVendorEntry } from '../eventVendors.types'

type EventVendorRecord = {
  id: string
  role: string
  vendor: {
    id: string
    slug: string
    username: string
    firstName: string
    lastName: string
    avatar: string | null
    isPro: boolean
    rating: number
  }
}

export function mapEventVendorEntry(record: EventVendorRecord): EventVendorEntry {
  return {
    id: record.id,
    vendorId: record.vendor.id,
    slug: record.vendor.slug,
    username: record.vendor.username,
    name: `${record.vendor.firstName} ${record.vendor.lastName}`.trim(),
    role: record.role,
    avatar: record.vendor.avatar,
    isPro: record.vendor.isPro,
    rating: record.vendor.rating,
  }
}
