import { describe, expect, it, vi } from 'vitest'
import { isEventReviewError, listEventVendorsForReview, rateEventVendor } from './eventReview.service'
import { EventReviewValidationError } from './eventReview.validation'

function vendorRecord(overrides = {}) {
  return {
    id: 'ev1',
    role: 'Фотограф',
    order: 0,
    vendor: {
      id: 'v1',
      slug: 'loginov',
      username: 'loginov_pho',
      firstName: 'Дмитрий',
      lastName: 'Логинов',
      avatar: null,
      isPro: true,
      rating: 4,
      photos: [{ url: 'work.jpg' }],
    },
    ...overrides,
  }
}

function deps(overrides = {}) {
  return {
    listEventVendors: vi.fn().mockResolvedValue([vendorRecord()]),
    listUserReviews: vi.fn().mockResolvedValue([{ vendorId: 'v1', rating: 4 }]),
    findEventVendor: vi.fn().mockResolvedValue(vendorRecord()),
    upsertReview: vi.fn().mockResolvedValue({ id: 'r1', vendorId: 'v1', rating: 5 }),
    refreshVendorRating: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('listEventVendorsForReview', () => {
  it('отдаёт пустой список без пользователя', async () => {
    expect(await listEventVendorsForReview('', 'evt-1', deps())).toEqual([])
  })

  it('подмешивает выставленную оценку в карточку', async () => {
    const items = await listEventVendorsForReview('u1', 'evt-1', deps())

    expect(items[0].myRating).toBe(4)
    expect(items[0].role).toBe('Фотограф')
  })

  it('оставляет оценку пустой, если пользователь ещё не оценивал', async () => {
    const items = await listEventVendorsForReview('u1', 'evt-1', deps({ listUserReviews: vi.fn().mockResolvedValue([]) }))

    expect(items[0].myRating).toBeNull()
  })

  it('берёт первое фото подрядчика как обложку работы', async () => {
    const items = await listEventVendorsForReview('u1', 'evt-1', deps())

    expect(items[0].workImage).toBe('work.jpg')
  })
})

describe('rateEventVendor', () => {
  it('сохраняет оценку', async () => {
    const dependencies = deps()
    const result = await rateEventVendor('u1', 'evt-1', { vendorId: 'v1', rating: 5 }, dependencies)

    expect(result.rating).toBe(5)
    expect(dependencies.upsertReview).toHaveBeenCalled()
  })

  it('пересчитывает рейтинг подрядчика после оценки', async () => {
    const dependencies = deps()
    await rateEventVendor('u1', 'evt-1', { vendorId: 'v1', rating: 5 }, dependencies)

    expect(dependencies.refreshVendorRating).toHaveBeenCalledWith('v1')
  })

  it('не даёт оценить подрядчика, не привязанного к мероприятию', async () => {
    const dependencies = deps({ findEventVendor: vi.fn().mockResolvedValue(null) })

    await expect(rateEventVendor('u1', 'evt-1', { vendorId: 'v9', rating: 5 }, dependencies)).rejects.toThrow(
      EventReviewValidationError,
    )
    expect(dependencies.upsertReview).not.toHaveBeenCalled()
  })

  it('отклоняет некорректную оценку до похода в базу', async () => {
    const dependencies = deps()

    await expect(rateEventVendor('u1', 'evt-1', { vendorId: 'v1', rating: 9 }, dependencies)).rejects.toThrow(
      'Оценка должна быть от 1 до 5',
    )
    expect(dependencies.findEventVendor).not.toHaveBeenCalled()
  })
})

describe('isEventReviewError', () => {
  it('узнаёт ошибку валидации отзыва', () => {
    expect(isEventReviewError(new EventReviewValidationError('нет'))).toBe(true)
  })

  it('не путает её с обычной ошибкой', () => {
    expect(isEventReviewError(new Error('нет'))).toBe(false)
  })
})
