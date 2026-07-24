import type { ProductCard } from '../productCard.types'

type ProductRecord = {
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
  category: { name: string; slug: string } | null
  photos: { id: string; url: string }[]
  attributes: { id: string; label: string; value: string }[]
  vendor: { userId: string; slug: string; firstName: string; lastName: string; username: string }
}

export function mapProductCard(record: ProductRecord): ProductCard {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    price: record.price,
    currency: record.currency,
    unit: record.unit,
    pricePrefix: record.pricePrefix,
    ctaLabel: record.ctaLabel,
    city: record.city,
    categoryName: record.category?.name ?? null,
    categorySlug: record.category?.slug ?? null,
    photos: record.photos.map((photo) => ({ id: photo.id, url: photo.url })),
    attributes: record.attributes.map((attribute) => ({
      id: attribute.id,
      label: attribute.label,
      value: attribute.value,
    })),
    vendor: {
      userId: record.vendor.userId,
      slug: record.vendor.slug,
      name: `${record.vendor.firstName} ${record.vendor.lastName}`.trim(),
      username: record.vendor.username,
    },
  }
}
