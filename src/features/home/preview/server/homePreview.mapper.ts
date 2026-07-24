import { formatBlogDate } from '@/features/blog/blog.format'
import type { HomeBlogPreview, HomeVendorPreview } from '../homePreview.types'

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80'
const FALLBACK_BLOG_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=375&fit=crop'

type VendorRecord = {
  id: string
  slug: string
  firstName: string
  lastName: string
  avatar: string | null
  rating: number
  pricePerHour: number | null
  specializations: { name: string }[]
  services: { category: { name: string } }[]
  photos: { url: string }[]
}

type BlogRecord = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  image: string | null
  category: string | null
  publishedAt: Date
}

function vendorSpec(vendor: VendorRecord): string {
  return vendor.specializations[0]?.name ?? vendor.services[0]?.category.name ?? 'Подрядчик'
}

export function mapHomeVendorPreview(vendor: VendorRecord): HomeVendorPreview {
  const avatar = vendor.avatar ?? FALLBACK_AVATAR
  const spec = vendorSpec(vendor)

  return {
    id: vendor.id,
    slug: vendor.slug,
    name: `${vendor.firstName} ${vendor.lastName}`.trim(),
    avatar,
    img: vendor.photos[0]?.url ?? avatar,
    spec,
    cat: spec,
    rating: vendor.rating,
    price: vendor.pricePerHour ?? 0,
  }
}

export function mapHomeBlogPreview(post: BlogRecord): HomeBlogPreview {
  return {
    id: post.id,
    slug: post.slug,
    cat: post.category ?? 'Гид',
    title: post.title,
    excerpt: post.excerpt ?? '',
    img: post.image ?? FALLBACK_BLOG_IMAGE,
    date: formatBlogDate(post.publishedAt),
  }
}
