export type Money = {
  amount: number
  currency: 'RUB' | 'USD' | 'EUR'
}

export type ImageAsset = {
  url: string
  alt: string
  width: number
  height: number
}

export type HomeHero = {
  title: string
  subtitle: string
  background: ImageAsset
  primaryAction: {
    label: string
    href: string
  }
}

export type HomeStat = {
  id: string
  label: string
  value: string
  icon: string
}

export type HomeBenefit = {
  id: string
  title: string
  description: string
  icon: string
}

export type HomeListingCard = {
  id: string
  title: string
  subtitle: string
  href: string
  image: ImageAsset
  priceFrom?: Money
}

export type HomeServiceCategory = {
  id: string
  title: string
  href: string
  image: ImageAsset
}

export type HomeBlogPreview = {
  id: string
  title: string
  excerpt: string
  category: string
  href: string
  image: ImageAsset
  publishedAt: string
}

export type HomeSeoGroup = {
  id: string
  title: string
  links: Array<{
    label: string
    href: string
  }>
}

export type HomePagePayload = {
  hero: HomeHero
  stats: HomeStat[]
  quickBenefits: HomeBenefit[]
  serviceAdvantages: HomeBenefit[]
  pickedForYou: HomeListingCard[]
  serviceCatalog: HomeServiceCategory[]
  venues: HomeListingCard[]
  photoOfDay: HomeListingCard[]
  blog: HomeBlogPreview[]
  photographers: HomeListingCard[]
  bridalLooks: HomeListingCard[]
  seoGroups: HomeSeoGroup[]
}
