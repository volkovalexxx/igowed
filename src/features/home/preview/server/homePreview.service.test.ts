import { describe, expect, it, vi } from 'vitest'
import { loadHomePreview } from './homePreview.service'

function vendorRecord(id: string) {
  return {
    id,
    slug: id,
    firstName: 'Дмитрий',
    lastName: 'Логинов',
    avatar: 'avatar.jpg',
    rating: 4,
    pricePerHour: 2500,
    specializations: [{ name: 'Свадьба' }],
    services: [{ category: { name: 'Фотосъёмка' } }],
    photos: [{ url: 'work.jpg' }],
  }
}

function blogRecord(id: string) {
  return {
    id,
    slug: id,
    title: 'Пост',
    excerpt: 'Отрывок',
    image: 'img.jpg',
    category: 'Гид',
    publishedAt: new Date('2026-03-20T00:00:00Z'),
  }
}

function deps(overrides = {}) {
  return {
    listTopVendors: vi.fn().mockResolvedValue([vendorRecord('v1'), vendorRecord('v2')]),
    listRecentPosts: vi.fn().mockResolvedValue([blogRecord('b1')]),
    ...overrides,
  }
}

describe('loadHomePreview', () => {
  it('маппит подрядчиков в витринную форму', async () => {
    const preview = await loadHomePreview(deps())

    expect(preview.vendors[0].name).toBe('Дмитрий Логинов')
    expect(preview.vendors[0].spec).toBe('Свадьба')
    expect(preview.vendors[0].img).toBe('work.jpg')
  })

  it('маппит посты блога с датой', async () => {
    const preview = await loadHomePreview(deps())

    expect(preview.blog[0].date).toBe('20 марта 2026')
    expect(preview.blog[0].slug).toBe('b1')
  })

  it('на пустой базе отдаёт пустые секции', async () => {
    const preview = await loadHomePreview(
      deps({ listTopVendors: vi.fn().mockResolvedValue([]), listRecentPosts: vi.fn().mockResolvedValue([]) }),
    )

    expect(preview.vendors).toEqual([])
    expect(preview.blog).toEqual([])
  })
})
