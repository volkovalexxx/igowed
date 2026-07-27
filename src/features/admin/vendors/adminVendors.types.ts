export type AdminVendorRow = {
  id: string
  name: string
  username: string
  slug: string
  city: string
  isPro: boolean
  isVerified: boolean
  isActive: boolean
  reviewCount: number
  rating: number
  createdAt: string
}

export type AdminVendorFlag = 'verified' | 'active'
