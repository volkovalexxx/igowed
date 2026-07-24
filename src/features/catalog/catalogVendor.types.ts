/** Подрядчик в каталоге — форма, которую рендерит `VendorCard`. */
export type CatalogVendor = {
  id: string
  name: string
  username: string
  slug: string
  avatar: string | null
  cities: string[]
  rating: number
  reviewCount: number
  pricePerHour: number
  currency: string
  tags: string[]
  photos: string[]
  description: string
}

export type CatalogSortOption = 'rating' | 'popular' | 'price_asc' | 'price_desc'

export type CatalogRatingFilter = 'any' | '5' | '4' | '3'
