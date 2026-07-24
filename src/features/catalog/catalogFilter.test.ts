import { describe, expect, it } from 'vitest'
import { filterAndSortVendors, type CatalogFilters } from './catalogFilter'
import type { CatalogVendor } from './catalogVendor.types'

function vendor(overrides: Partial<CatalogVendor> = {}): CatalogVendor {
  return {
    id: 'v1',
    name: 'Дмитрий Логинов',
    username: 'loginov_pho',
    slug: 'loginov_pho',
    avatar: null,
    cities: ['Минск'],
    rating: 4,
    reviewCount: 10,
    pricePerHour: 2500,
    currency: 'RUB',
    tags: ['Свадьба'],
    photos: [],
    description: 'Свадебный фотограф',
    ...overrides,
  }
}

const base: CatalogFilters = {
  searchText: '',
  priceFrom: '',
  priceTo: '',
  ratingFilter: 'any',
  sortBy: 'rating',
}

describe('filterAndSortVendors', () => {
  it('без фильтров возвращает всех', () => {
    const list = filterAndSortVendors([vendor(), vendor({ id: 'v2' })], base)
    expect(list).toHaveLength(2)
  })

  it('ищет по имени, тегам и описанию', () => {
    const vendors = [
      vendor({ id: 'byname', name: 'Анна Смирнова' }),
      vendor({ id: 'bytag', name: 'Пётр', tags: ['Портрет'] }),
      vendor({ id: 'bydesc', name: 'Иван', tags: [], description: 'корпоративная съёмка' }),
    ]

    expect(filterAndSortVendors(vendors, { ...base, searchText: 'смирнова' }).map((v) => v.id)).toEqual(['byname'])
    expect(filterAndSortVendors(vendors, { ...base, searchText: 'портрет' }).map((v) => v.id)).toEqual(['bytag'])
    expect(filterAndSortVendors(vendors, { ...base, searchText: 'корпоратив' }).map((v) => v.id)).toEqual(['bydesc'])
  })

  it('фильтрует по нижней и верхней границе цены', () => {
    const vendors = [vendor({ id: 'cheap', pricePerHour: 1000 }), vendor({ id: 'mid', pricePerHour: 3000 }), vendor({ id: 'pricey', pricePerHour: 9000 })]

    expect(filterAndSortVendors(vendors, { ...base, priceFrom: '2000', priceTo: '5000' }).map((v) => v.id)).toEqual(['mid'])
  })

  it('фильтрует по минимальному рейтингу', () => {
    const vendors = [vendor({ id: 'low', rating: 3 }), vendor({ id: 'high', rating: 5 })]

    expect(filterAndSortVendors(vendors, { ...base, ratingFilter: '4' }).map((v) => v.id)).toEqual(['high'])
  })

  it('сортирует по рейтингу убыванием', () => {
    const vendors = [vendor({ id: 'a', rating: 3 }), vendor({ id: 'b', rating: 5 }), vendor({ id: 'c', rating: 4 })]

    expect(filterAndSortVendors(vendors, { ...base, sortBy: 'rating' }).map((v) => v.id)).toEqual(['b', 'c', 'a'])
  })

  it('сортирует по цене возрастанием и убыванием', () => {
    const vendors = [vendor({ id: 'mid', pricePerHour: 3000 }), vendor({ id: 'cheap', pricePerHour: 1000 }), vendor({ id: 'pricey', pricePerHour: 9000 })]

    expect(filterAndSortVendors(vendors, { ...base, sortBy: 'price_asc' }).map((v) => v.id)).toEqual(['cheap', 'mid', 'pricey'])
    expect(filterAndSortVendors(vendors, { ...base, sortBy: 'price_desc' }).map((v) => v.id)).toEqual(['pricey', 'mid', 'cheap'])
  })

  it('сортирует по популярности (числу отзывов)', () => {
    const vendors = [vendor({ id: 'few', reviewCount: 2 }), vendor({ id: 'many', reviewCount: 40 })]

    expect(filterAndSortVendors(vendors, { ...base, sortBy: 'popular' }).map((v) => v.id)).toEqual(['many', 'few'])
  })

  it('не мутирует исходный массив', () => {
    const vendors = [vendor({ id: 'a', rating: 3 }), vendor({ id: 'b', rating: 5 })]
    filterAndSortVendors(vendors, { ...base, sortBy: 'rating' })

    expect(vendors[0].id).toBe('a')
  })
})
