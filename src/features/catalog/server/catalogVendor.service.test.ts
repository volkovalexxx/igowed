import { describe, expect, it, vi } from 'vitest'
import { listCatalogVendors } from './catalogVendor.service'

function vendorRecord(overrides = {}) {
  return {
    id: 'v1',
    slug: 'loginov',
    firstName: 'Дмитрий',
    lastName: 'Логинов',
    username: 'loginov_pho',
    avatar: null,
    cities: ['Минск'],
    rating: 4,
    reviewCount: 10,
    pricePerHour: 2500,
    currency: 'RUB',
    bio: 'Фотограф',
    specializations: [{ name: 'Свадьба' }],
    services: [{ category: { name: 'Фотосъёмка' } }],
    photos: [{ url: 'a.jpg' }],
    ...overrides,
  }
}

function deps(overrides = {}) {
  return {
    listActiveVendors: vi.fn().mockResolvedValue([vendorRecord()]),
    ...overrides,
  }
}

describe('listCatalogVendors', () => {
  it('маппит записи в карточки каталога', async () => {
    const vendors = await listCatalogVendors(deps())

    expect(vendors[0].name).toBe('Дмитрий Логинов')
    expect(vendors[0].tags).toEqual(['Свадьба'])
    expect(vendors[0].photos).toEqual(['a.jpg'])
  })

  it('берёт категории услуг как теги, если специализаций нет', async () => {
    const vendors = await listCatalogVendors(deps({ listActiveVendors: vi.fn().mockResolvedValue([vendorRecord({ specializations: [] })]) }))

    expect(vendors[0].tags).toEqual(['Фотосъёмка'])
  })

  it('нулевую ставку отдаёт как 0', async () => {
    const vendors = await listCatalogVendors(deps({ listActiveVendors: vi.fn().mockResolvedValue([vendorRecord({ pricePerHour: null })]) }))

    expect(vendors[0].pricePerHour).toBe(0)
  })

  it('на пустом каталоге отдаёт пустой список', async () => {
    const vendors = await listCatalogVendors(deps({ listActiveVendors: vi.fn().mockResolvedValue([]) }))

    expect(vendors).toEqual([])
  })
})
