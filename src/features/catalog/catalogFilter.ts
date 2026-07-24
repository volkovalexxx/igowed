import type { CatalogRatingFilter, CatalogSortOption, CatalogVendor } from './catalogVendor.types'

export type CatalogFilters = {
  searchText: string
  priceFrom: string
  priceTo: string
  ratingFilter: CatalogRatingFilter
  sortBy: CatalogSortOption
}

function matchesSearch(vendor: CatalogVendor, query: string): boolean {
  return (
    vendor.name.toLowerCase().includes(query) ||
    vendor.tags.some((tag) => tag.toLowerCase().includes(query)) ||
    vendor.description.toLowerCase().includes(query)
  )
}

const SORTERS: Record<CatalogSortOption, (a: CatalogVendor, b: CatalogVendor) => number> = {
  rating: (a, b) => b.rating - a.rating,
  popular: (a, b) => b.reviewCount - a.reviewCount,
  price_asc: (a, b) => a.pricePerHour - b.pricePerHour,
  price_desc: (a, b) => b.pricePerHour - a.pricePerHour,
}

export function filterAndSortVendors(vendors: readonly CatalogVendor[], filters: CatalogFilters): CatalogVendor[] {
  let list = [...vendors]

  const query = filters.searchText.trim().toLowerCase()
  if (query) {
    list = list.filter((vendor) => matchesSearch(vendor, query))
  }

  if (filters.priceFrom) {
    list = list.filter((vendor) => vendor.pricePerHour >= Number(filters.priceFrom))
  }
  if (filters.priceTo) {
    list = list.filter((vendor) => vendor.pricePerHour <= Number(filters.priceTo))
  }

  if (filters.ratingFilter !== 'any') {
    const min = Number(filters.ratingFilter)
    list = list.filter((vendor) => vendor.rating >= min)
  }

  return list.sort(SORTERS[filters.sortBy])
}
