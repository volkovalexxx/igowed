import { describe, expect, it, vi } from 'vitest'
import { getProductBySlug } from './productCard.service'

function productRecord(overrides = {}) {
  return {
    id: 'p1',
    slug: 'sprinter',
    title: 'Мерседес Спринтер',
    description: 'Микроавтобус',
    price: 2800,
    currency: 'RUB',
    unit: 'час',
    pricePrefix: true,
    ctaLabel: 'Связаться',
    city: 'Гродно',
    category: { name: 'Транспорт', slug: 'transport' },
    photos: [{ id: 'ph1', url: 'a.jpg' }],
    attributes: [{ id: 'a1', label: 'Цвет', value: 'белый' }],
    vendor: { userId: 'u-carcar', slug: 'carcar', firstName: 'Иван', lastName: 'Петров', username: 'carcar' },
    ...overrides,
  }
}

function deps(overrides = {}) {
  return {
    findProductBySlug: vi.fn().mockResolvedValue(productRecord()),
    ...overrides,
  }
}

describe('getProductBySlug', () => {
  it('отдаёт null без слага', async () => {
    const dependencies = deps()

    expect(await getProductBySlug('', dependencies)).toBeNull()
    expect(dependencies.findProductBySlug).not.toHaveBeenCalled()
  })

  it('отдаёт null, если товар не найден', async () => {
    expect(await getProductBySlug('нет', deps({ findProductBySlug: vi.fn().mockResolvedValue(null) }))).toBeNull()
  })

  it('маппит запись в карточку товара', async () => {
    const card = await getProductBySlug('sprinter', deps())

    expect(card?.title).toBe('Мерседес Спринтер')
    expect(card?.vendor.name).toBe('Иван Петров')
    expect(card?.categorySlug).toBe('transport')
    expect(card?.attributes[0]).toEqual({ id: 'a1', label: 'Цвет', value: 'белый' })
  })
})
