import type { BoardVendor } from '../vendorBoard.types'

type VendorRecord = {
  id: string
  userId: string
  slug: string
  username: string
  firstName: string
  lastName: string
  avatar: string | null
  isPro: boolean
  rating: number
  pricePerHour: number | null
  photos: { url: string }[]
  services: { category: { name: string } | null }[]
}

export function mapBoardVendorRecord(vendor: VendorRecord): BoardVendor {
  return {
    id: vendor.id,
    userId: vendor.userId,
    slug: vendor.slug,
    username: vendor.username,
    firstName: vendor.firstName,
    lastName: vendor.lastName,
    avatar: vendor.avatar,
    isPro: vendor.isPro,
    rating: vendor.rating,
    pricePerHour: vendor.pricePerHour,
    photoUrl: vendor.photos[0]?.url ?? null,
    categoryName: vendor.services[0]?.category?.name ?? null,
  }
}
