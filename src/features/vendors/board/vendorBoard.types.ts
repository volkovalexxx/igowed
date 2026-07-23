/** Подрядчик в том виде, в каком его показывают доски избранного и шорт-листа. */
export type BoardVendor = {
  id: string
  slug: string
  username: string
  firstName: string
  lastName: string
  avatar: string | null
  isPro: boolean
  rating: number
  pricePerHour: number | null
  photoUrl: string | null
  categoryName: string | null
}

export type VendorBoardKind = 'favorites' | 'shortlist'
