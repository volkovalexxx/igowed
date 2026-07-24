export type DisplayMode = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE'

export type BusinessType = 'IP' | 'OOO' | 'INDIVIDUAL'

/** Запись подрядчика в форме, которой владеет кабинет. */
export type VendorProfileRecord = {
  id: string
  firstName: string
  lastName: string
  username: string
  bio: string | null
  country: string
  cities: string[]
  phone: string | null
  phone2: string | null
  website: string | null
  instagram: string | null
  address: string | null
  businessType: string | null
  bankDetails: string | null
  workingHours: string | null
  languages: string[]
  galleryDisplay: DisplayMode
  cardDisplay: DisplayMode
  specializations: string[]
}

export type ProfileFormData = {
  firstName: string
  lastName: string
  activity: string
  languages: string[]
  login: string
  country: string
  cities: string[]
  phone: string
  phone2: string
  specializations: string[]
  website: string
  instagram: string
  descriptionPhotographer: string
  descriptionTransport: string
  displayMode: DisplayMode
  cardMode: DisplayMode
  address: string
  contactPhone: string
  bankDetails: string
  activityType: BusinessType
  workFrom: string
  workTo: string
}

/** Тело PATCH /api/vendors/[id]. */
export type VendorProfilePatch = {
  firstName: string
  lastName: string
  username: string
  bio: string
  country: string
  cities: string[]
  phone: string
  phone2: string
  website: string
  instagram: string
  address: string
  businessType: string
  bankDetails: string
  workingHours: string
  languages: string[]
  galleryDisplay: DisplayMode
  cardDisplay: DisplayMode
  specializations: string[]
}
