export type DisplayMode = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE'

export type ProfileService = {
  id: string
  category: string
  price: string
  description: string
}

export type ProfileReview = {
  id: string
  userName: string
  userAvatar: string
  date: string
  rating: number
  text: string
}

export type ProfilePhoto = {
  id: string
  src: string
  alt: string
}

export type VendorProfile = {
  userId: string
  slug: string
  name: string
  username: string
  city: string
  isPro: boolean
  rating: number
  reviewCount: number
  photosCount: number
  price: string
  coverPhoto: string
  avatar: string
  displayMode: DisplayMode
  bio: string
  address: string
  phone: string
  website: string
  instagram: string
  languages: string[]
  workingHours: string
  bankDetails: string
  photos: ProfilePhoto[]
  services: ProfileService[]
  reviews: ProfileReview[]
}
