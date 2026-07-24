export type ProductPhoto = {
  id: string
  url: string
}

export type ProductAttribute = {
  id: string
  label: string
  value: string
}

export type ProductVendorRef = {
  userId: string
  slug: string
  name: string
  username: string
}

export type ProductCard = {
  id: string
  slug: string
  title: string
  description: string | null
  price: number | null
  currency: string
  unit: string | null
  pricePrefix: boolean
  ctaLabel: string
  city: string | null
  categoryName: string | null
  categorySlug: string | null
  photos: ProductPhoto[]
  attributes: ProductAttribute[]
  vendor: ProductVendorRef
}

export type Breadcrumb = {
  label: string
  href: string | null
}
