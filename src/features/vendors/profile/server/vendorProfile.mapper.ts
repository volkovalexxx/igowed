import { formatProfilePrice, formatReviewDate, formatServicePrice } from '../vendorProfile.format'
import type { DisplayMode, VendorProfile } from '../vendorProfile.types'

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80'
const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'
const FALLBACK_REVIEW_AVATAR =
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'

type VendorRecord = {
  userId: string
  slug: string
  firstName: string
  lastName: string
  username: string
  bio: string | null
  avatar: string | null
  isPro: boolean
  country: string
  cities: string[]
  phone: string | null
  website: string | null
  instagram: string | null
  address: string | null
  workingHours: string | null
  bankDetails: string | null
  languages: string[]
  galleryDisplay: DisplayMode
  rating: number
  reviewCount: number
  pricePerHour: number | null
  currency: string
  photos: { id: string; url: string }[]
  services: { id: string; price: number | null; currency: string; unit: string | null; description: string | null; category: { name: string } }[]
  reviews: { id: string; rating: number; text: string | null; createdAt: Date; user: { name: string | null; image: string | null } }[]
}

export function mapVendorProfile(vendor: VendorRecord): VendorProfile {
  return {
    userId: vendor.userId,
    slug: vendor.slug,
    name: `${vendor.firstName} ${vendor.lastName}`.trim(),
    username: `@${vendor.username}`,
    city: vendor.cities[0] ?? vendor.country,
    isPro: vendor.isPro,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    photosCount: vendor.photos.length,
    price: formatProfilePrice(vendor.pricePerHour, vendor.currency),
    coverPhoto: vendor.photos[0]?.url ?? vendor.avatar ?? FALLBACK_COVER,
    avatar: vendor.avatar ?? FALLBACK_AVATAR,
    displayMode: vendor.galleryDisplay,
    bio: vendor.bio ?? '',
    address: vendor.address ?? '',
    phone: vendor.phone ?? '',
    website: vendor.website ?? '',
    instagram: vendor.instagram ?? '',
    languages: vendor.languages,
    workingHours: vendor.workingHours ?? '',
    bankDetails: vendor.bankDetails ?? '',
    photos: vendor.photos.map((photo, index) => ({ id: photo.id, src: photo.url, alt: `Фото ${index + 1}` })),
    services: vendor.services.map((service) => ({
      id: service.id,
      category: service.category.name,
      price: formatServicePrice(service.price, service.currency, service.unit),
      description: service.description ?? '',
    })),
    reviews: vendor.reviews.map((review) => ({
      id: review.id,
      userName: review.user.name ?? 'Гость',
      userAvatar: review.user.image ?? FALLBACK_REVIEW_AVATAR,
      date: formatReviewDate(review.createdAt),
      rating: review.rating,
      text: review.text ?? '',
    })),
  }
}
