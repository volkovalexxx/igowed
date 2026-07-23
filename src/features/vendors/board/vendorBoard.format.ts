import { formatAmount } from '@/lib/currency/currency.format'
import { FALLBACK_VENDOR_IMAGES } from './vendorBoard.data'
import type { BoardVendor } from './vendorBoard.types'

export function getVendorName(vendor: BoardVendor): string {
  return `${vendor.firstName} ${vendor.lastName}`.trim()
}

export function getVendorRole(vendor: BoardVendor): string {
  return vendor.categoryName || 'Подрядчик'
}

export function getVendorImage(vendor: BoardVendor, index: number): string {
  return vendor.avatar || vendor.photoUrl || FALLBACK_VENDOR_IMAGES[index % FALLBACK_VENDOR_IMAGES.length]
}

export function formatVendorPrice(pricePerHour: number | null): string {
  if (!pricePerHour) return 'Цена по запросу'
  return `от ${formatAmount(pricePerHour)} RUB / час`
}
