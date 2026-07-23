import { mapEventVendorRecord } from './eventReview.mapper'
import { EventReviewValidationError, parseRateVendorInput } from './eventReview.validation'

type EventReviewDeps = {
  listEventVendors(userId: string, eventId: string): Promise<Parameters<typeof mapEventVendorRecord>[0][]>
  listUserReviews(userId: string, eventId: string): Promise<{ vendorId: string; rating: number }[]>
  findEventVendor(
    userId: string,
    eventId: string,
    vendorId: string,
  ): Promise<Parameters<typeof mapEventVendorRecord>[0] | null>
  upsertReview(input: {
    userId: string
    eventId: string
    vendorId: string
    rating: number
    text: string | null
  }): Promise<{ id: string; vendorId: string; rating: number }>
  refreshVendorRating(vendorId: string): Promise<void>
}

export async function listEventVendorsForReview(userId: string, eventId: string, deps: EventReviewDeps) {
  if (!userId || !eventId) return []

  const [vendors, reviews] = await Promise.all([
    deps.listEventVendors(userId, eventId),
    deps.listUserReviews(userId, eventId),
  ])

  const ratingByVendor = new Map(reviews.map((review) => [review.vendorId, review.rating]))

  return vendors.map((record) => mapEventVendorRecord(record, ratingByVendor.get(record.vendor.id) ?? null))
}

/** Оценить можно только подрядчика, привязанного к этому мероприятию текущего пользователя. */
export async function rateEventVendor(userId: string, eventId: string, rawInput: unknown, deps: EventReviewDeps) {
  const input = parseRateVendorInput(rawInput)

  const eventVendor = await deps.findEventVendor(userId, eventId, input.vendorId)
  if (!eventVendor) {
    throw new EventReviewValidationError('Подрядчик не найден среди участников мероприятия')
  }

  const review = await deps.upsertReview({
    userId,
    eventId,
    vendorId: input.vendorId,
    rating: input.rating,
    text: input.text,
  })

  await deps.refreshVendorRating(input.vendorId)

  return review
}

export function isEventReviewError(error: unknown): error is EventReviewValidationError {
  return error instanceof EventReviewValidationError
}
