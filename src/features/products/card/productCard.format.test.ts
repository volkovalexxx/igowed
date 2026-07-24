import { describe, expect, it } from 'vitest'
import { buildProductBreadcrumbs, formatProductPrice } from './productCard.format'
import type { ProductCard } from './productCard.types'

function product(overrides: Partial<ProductCard> = {}): ProductCard {
  return {
    id: 'p1',
    slug: 'sprinter',
    title: 'Мерседес Спринтер',
    description: null,
    price: 2800,
    currency: 'RUB',
    unit: 'час',
    pricePrefix: true,
    ctaLabel: 'Связаться',
    city: 'Гродно',
    categoryName: 'Транспорт',
    categorySlug: 'transport',
    photos: [],
    attributes: [],
    vendor: { userId: 'u-carcar', slug: 'carcar', name: 'CarCar', username: 'carcar' },
    ...overrides,
  }
}

describe('formatProductPrice', () => {
  it('склеивает префикс, сумму, валюту и единицу', () => {
    expect(formatProductPrice(product())).toMatch(/^от 2\s800 руб \/ час$/)
  })

  it('без единицы даёт фиксированную цену', () => {
    expect(formatProductPrice(product({ price: 80000, unit: null, pricePrefix: false }))).toMatch(/^80\s000 руб$/)
  })

  it('маппит код RUB в рубли, BYN оставляет как есть', () => {
    expect(formatProductPrice(product({ currency: 'BYN', unit: null, pricePrefix: false }))).toMatch(/BYN$/)
  })

  it('без цены отдаёт «Цена по запросу»', () => {
    expect(formatProductPrice(product({ price: null }))).toBe('Цена по запросу')
  })
})

describe('buildProductBreadcrumbs', () => {
  it('строит цепочку от главной до товара', () => {
    expect(buildProductBreadcrumbs(product())).toEqual([
      { label: 'Главная', href: '/' },
      { label: 'Каталог', href: '/catalog' },
      { label: 'Транспорт', href: '/catalog?cat=transport' },
      { label: 'Мерседес Спринтер', href: null },
    ])
  })

  it('пропускает категорию, если её нет', () => {
    const crumbs = buildProductBreadcrumbs(product({ categoryName: null, categorySlug: null }))

    expect(crumbs.map((crumb) => crumb.label)).toEqual(['Главная', 'Каталог', 'Мерседес Спринтер'])
  })
})
