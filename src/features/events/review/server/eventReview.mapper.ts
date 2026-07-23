import type { EventVendorReview } from '../eventReview.types'

type EventVendorRecord = {
  id: string
  role: string
  order: number
  vendor: {
    id: string
    slug: string
    username: string
    firstName: string
    lastName: string
    avatar: string | null
    isPro: boolean
    rating: number
    photos: { url: string }[]
  }
}

export function mapEventVendorRecord(record: EventVendorRecord, myRating: number | null): EventVendorReview {
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
    workImage: record.vendor.photos[0]?.url ?? null,
    myRating,
  }
}
