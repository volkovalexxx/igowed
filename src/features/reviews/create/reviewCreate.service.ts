import { parseCreateReviewInput, ReviewValidationError } from './reviewCreate.validation'

export type CreatedReview = {
  id: string
  rating: number
  updated: boolean
}

export type ReviewEligibility = {
  eligible: boolean
  alreadyReviewed: boolean
}

export type ReviewCreateDeps = {
  findVendorIdBySlug(slug: string): Promise<string | null>
  hasCompletedBooking(userId: string, vendorId: string): Promise<boolean>
  findDirectReviewId(userId: string, vendorId: string): Promise<string | null>
  createReview(input: { userId: string; vendorId: string; rating: number; text: string | null }): Promise<{ id: string; rating: number }>
  updateReview(reviewId: string, rating: number, text: string | null): Promise<{ id: string; rating: number }>
  refreshVendorRating(vendorId: string): Promise<void>
}

/**
 * Отзыв о подрядчике может оставить клиент с завершённым заказом у него. Один прямой отзыв
 * (без привязки к мероприятию) на пару клиент–подрядчик; повтор редактирует существующий.
 */
export async function createBookingReview(userId: string, rawInput: unknown, deps: ReviewCreateDeps): Promise<CreatedReview> {
  if (!userId) {
    throw new ReviewValidationError('Требуется авторизация', 401)
  }

  const input = parseCreateReviewInput(rawInput)

  const vendorId = await deps.findVendorIdBySlug(input.vendorSlug)
  if (!vendorId) {
    throw new ReviewValidationError('Подрядчик не найден', 404)
  }

  const allowed = await deps.hasCompletedBooking(userId, vendorId)
  if (!allowed) {
    throw new ReviewValidationError('Оставить отзыв можно после завершённого заказа', 403)
  }

  const existingId = await deps.findDirectReviewId(userId, vendorId)
  const review = existingId
    ? await deps.updateReview(existingId, input.rating, input.text)
    : await deps.createReview({ userId, vendorId, rating: input.rating, text: input.text })

  await deps.refreshVendorRating(vendorId)

  return { id: review.id, rating: review.rating, updated: Boolean(existingId) }
}

/** Может ли пользователь оставить отзыв этому подрядчику и оставлял ли уже (для CTA на профиле). */
export async function getReviewEligibility(userId: string, vendorSlug: string, deps: ReviewCreateDeps): Promise<ReviewEligibility> {
  if (!userId) return { eligible: false, alreadyReviewed: false }

  const vendorId = await deps.findVendorIdBySlug(vendorSlug)
  if (!vendorId) return { eligible: false, alreadyReviewed: false }

  const [eligible, existingId] = await Promise.all([
    deps.hasCompletedBooking(userId, vendorId),
    deps.findDirectReviewId(userId, vendorId),
  ])

  return { eligible, alreadyReviewed: Boolean(existingId) }
}

export function isReviewError(error: unknown): error is ReviewValidationError {
  return error instanceof ReviewValidationError
}
