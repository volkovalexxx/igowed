import type { CatalogVendor } from '../catalogVendor.types'

type VendorRecord = {
  id: string
  slug: string
  firstName: string
  lastName: string
  username: string
  avatar: string | null
  cities: string[]
  rating: number
  reviewCount: number
  pricePerHour: number | null
  currency: string
  bio: string | null
  specializations: { name: string }[]
  services: { category: { name: string } }[]
  photos: { url: string }[]
}

/** Теги карточки — специализации подрядчика, а без них — категории его услуг. */
function collectTags(vendor: VendorRecord): string[] {
  const fromSpecializations = vendor.specializations.map((item) => item.name)
  if (fromSpecializations.length > 0) return fromSpecializations

  return [...new Set(vendor.services.map((service) => service.category.name))]
}

export function mapCatalogVendor(vendor: VendorRecord): CatalogVendor {
  return {
    id: vendor.id,
    name: `${vendor.firstName} ${vendor.lastName}`.trim(),
    username: vendor.username,
    slug: vendor.slug,
    avatar: vendor.avatar,
    cities: vendor.cities,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    pricePerHour: vendor.pricePerHour ?? 0,
    currency: vendor.currency,
    tags: collectTags(vendor),
    photos: vendor.photos.map((photo) => photo.url),
    description: vendor.bio ?? '',
  }
}
