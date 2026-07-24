import { describe, expect, it, vi } from 'vitest'
import { getVendorProfile } from './vendorProfile.service'

function vendorRecord(overrides = {}) {
  return {
    userId: 'u1',
    slug: 'loginov',
    firstName: 'Дмитрий',
    lastName: 'Логинов',
    username: 'loginov_pho',
    bio: 'Фотограф',
    avatar: 'avatar.jpg',
    isPro: true,
    country: 'Беларусь',
    cities: ['Минск', 'Гродно'],
    phone: '+375291123456',
    website: null,
    instagram: null,
    address: null,
    workingHours: null,
    bankDetails: null,
    languages: ['Русский'],
    galleryDisplay: 'VERTICAL' as const,
    rating: 4,
    reviewCount: 3,
    pricePerHour: 2500,
    currency: 'RUB',
    photos: [{ id: 'ph1', url: 'photo1.jpg' }],
    services: [{ id: 's1', price: 5000, currency: 'RUB', unit: 'час', description: 'Свадебная съёмка', category: { name: 'Свадьба' } }],
    reviews: [{ id: 'r1', rating: 5, text: 'Отлично', createdAt: new Date('2025-03-15T00:00:00Z'), user: { name: 'Мария', image: null } }],
    ...overrides,
  }
}

function deps(overrides = {}) {
  return {
    findVendorBySlug: vi.fn().mockResolvedValue(vendorRecord()),
    ...overrides,
  }
}

describe('getVendorProfile', () => {
  it('null без слага', async () => {
    const dependencies = deps()

    expect(await getVendorProfile('', dependencies)).toBeNull()
    expect(dependencies.findVendorBySlug).not.toHaveBeenCalled()
  })

  it('null, если подрядчик не найден', async () => {
    expect(await getVendorProfile('нет', deps({ findVendorBySlug: vi.fn().mockResolvedValue(null) }))).toBeNull()
  })

  it('маппит запись в профиль с userId для чата', async () => {
    const profile = await getVendorProfile('loginov', deps())

    expect(profile?.userId).toBe('u1')
    expect(profile?.name).toBe('Дмитрий Логинов')
    expect(profile?.username).toBe('@loginov_pho')
    expect(profile?.city).toBe('Минск')
    expect(profile?.photosCount).toBe(1)
  })

  it('форматирует цену услуги и дату отзыва', async () => {
    const profile = await getVendorProfile('loginov', deps())

    expect(profile?.services[0].price).toMatch(/5\s000 руб \/ час/)
    expect(profile?.reviews[0].date).toBe('15 марта 2025')
  })
})
