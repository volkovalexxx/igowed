import { describe, expect, it, vi } from 'vitest'
import { createBookingReview, getReviewEligibility, isReviewError } from './reviewCreate.service'
import { ReviewValidationError } from './reviewCreate.validation'

function makeDeps(overrides: Partial<Parameters<typeof createBookingReview>[2]> = {}) {
  return {
    findVendorIdBySlug: vi.fn(async (): Promise<string | null> => 'v1'),
    hasCompletedBooking: vi.fn(async () => true),
    findDirectReviewId: vi.fn(async (): Promise<string | null> => null),
    createReview: vi.fn(async () => ({ id: 'r1', rating: 5 })),
    updateReview: vi.fn(async () => ({ id: 'old', rating: 4 })),
    refreshVendorRating: vi.fn(async () => {}),
    ...overrides,
  }
}

const validInput = { vendorSlug: 'nice-photo', rating: 5, text: 'Супер' }

describe('createBookingReview', () => {
  it('requires an authenticated user', async () => {
    const deps = makeDeps()
    await expect(createBookingReview('', validInput, deps)).rejects.toMatchObject({ status: 401 })
    expect(deps.findVendorIdBySlug).not.toHaveBeenCalled()
  })

  it('rejects an out-of-range rating', async () => {
    const deps = makeDeps()
    await expect(createBookingReview('u1', { vendorSlug: 'nice-photo', rating: 6 }, deps)).rejects.toThrow('от 1 до 5')
  })

  it('throws 404 for a missing vendor', async () => {
    const deps = makeDeps({ findVendorIdBySlug: vi.fn(async () => null) })
    await expect(createBookingReview('u1', validInput, deps)).rejects.toMatchObject({ status: 404 })
  })

  it('forbids reviewing without a completed booking (403)', async () => {
    const deps = makeDeps({ hasCompletedBooking: vi.fn(async () => false) })
    await expect(createBookingReview('u1', validInput, deps)).rejects.toMatchObject({ status: 403 })
    expect(deps.createReview).not.toHaveBeenCalled()
  })

  it('creates a new review and refreshes the rating', async () => {
    const deps = makeDeps()
    const result = await createBookingReview('u1', validInput, deps)
    expect(result).toEqual({ id: 'r1', rating: 5, updated: false })
    expect(deps.createReview).toHaveBeenCalledWith({ userId: 'u1', vendorId: 'v1', rating: 5, text: 'Супер' })
    expect(deps.updateReview).not.toHaveBeenCalled()
    expect(deps.refreshVendorRating).toHaveBeenCalledWith('v1')
  })

  it('updates an existing direct review instead of duplicating', async () => {
    const deps = makeDeps({ findDirectReviewId: vi.fn(async () => 'old') })
    const result = await createBookingReview('u1', { vendorSlug: 'nice-photo', rating: 4, text: null }, deps)
    expect(result).toEqual({ id: 'old', rating: 4, updated: true })
    expect(deps.updateReview).toHaveBeenCalledWith('old', 4, null)
    expect(deps.createReview).not.toHaveBeenCalled()
    expect(deps.refreshVendorRating).toHaveBeenCalledWith('v1')
  })
})

describe('getReviewEligibility', () => {
  it('returns not-eligible for anonymous users without hitting the repo', async () => {
    const deps = makeDeps()
    expect(await getReviewEligibility('', 'nice-photo', deps)).toEqual({ eligible: false, alreadyReviewed: false })
    expect(deps.findVendorIdBySlug).not.toHaveBeenCalled()
  })

  it('returns not-eligible when the vendor is missing', async () => {
    const deps = makeDeps({ findVendorIdBySlug: vi.fn(async () => null) })
    expect(await getReviewEligibility('u1', 'ghost', deps)).toEqual({ eligible: false, alreadyReviewed: false })
  })

  it('reports eligibility and prior review', async () => {
    const deps = makeDeps({ hasCompletedBooking: vi.fn(async () => true), findDirectReviewId: vi.fn(async () => 'old') })
    expect(await getReviewEligibility('u1', 'nice-photo', deps)).toEqual({ eligible: true, alreadyReviewed: true })
  })

  it('reports eligible-but-not-yet-reviewed', async () => {
    const deps = makeDeps({ hasCompletedBooking: vi.fn(async () => true), findDirectReviewId: vi.fn(async () => null) })
    expect(await getReviewEligibility('u1', 'nice-photo', deps)).toEqual({ eligible: true, alreadyReviewed: false })
  })
})

describe('isReviewError', () => {
  it('detects review errors', () => {
    expect(isReviewError(new ReviewValidationError('x'))).toBe(true)
    expect(isReviewError(new Error('x'))).toBe(false)
  })
})
