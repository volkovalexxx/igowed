import { describe, expect, it } from 'vitest'
import { formatVendorPrice, getVendorImage, getVendorName, getVendorRole } from './vendorBoard.format'
import type { BoardVendor } from './vendorBoard.types'

function vendor(overrides: Partial<BoardVendor> = {}): BoardVendor {
  return {
    id: 'v1',
    userId: 'u1',
    slug: 'dmitry-loginov',
    username: 'loginov_pho',
    firstName: 'Дмитрий',
    lastName: 'Логинов',
    avatar: null,
    isPro: true,
    rating: 4,
    pricePerHour: 5000,
    photoUrl: null,
    categoryName: 'Фотограф',
    ...overrides,
  }
}

describe('getVendorName', () => {
  it('склеивает имя и фамилию', () => {
    expect(getVendorName(vendor())).toBe('Дмитрий Логинов')
  })

  it('не оставляет висящий пробел без фамилии', () => {
    expect(getVendorName(vendor({ lastName: '' }))).toBe('Дмитрий')
  })
})

describe('getVendorRole', () => {
  it('берёт категорию услуги', () => {
    expect(getVendorRole(vendor())).toBe('Фотограф')
  })

  it('падает на «Подрядчик», если категории нет', () => {
    expect(getVendorRole(vendor({ categoryName: null }))).toBe('Подрядчик')
  })
})

describe('getVendorImage', () => {
  it('предпочитает аватар', () => {
    expect(getVendorImage(vendor({ avatar: 'a.jpg', photoUrl: 'p.jpg' }), 0)).toBe('a.jpg')
  })

  it('берёт фото, если аватара нет', () => {
    expect(getVendorImage(vendor({ photoUrl: 'p.jpg' }), 0)).toBe('p.jpg')
  })

  it('без картинок отдаёт запасную и не выходит за границы набора', () => {
    const first = getVendorImage(vendor(), 0)
    const wrapped = getVendorImage(vendor(), 300)

    expect(first).toMatch(/^https:\/\//)
    expect(wrapped).toMatch(/^https:\/\//)
  })

  it('чередует запасные картинки между карточками', () => {
    expect(getVendorImage(vendor(), 0)).not.toBe(getVendorImage(vendor(), 1))
  })
})

describe('formatVendorPrice', () => {
  // Разделитель разрядов у Intl — неразрывный пробел, узкий или обычный в зависимости от ICU.
  it('разделяет разряды', () => {
    expect(formatVendorPrice(5000)).toMatch(/^от 5\s000 RUB \/ час$/)
  })

  it('подставляет заглушку без цены', () => {
    expect(formatVendorPrice(null)).toBe('Цена по запросу')
  })
})
