export class EventReviewValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventReviewValidationError'
  }
}

export type RateVendorInput = {
  vendorId: string
  rating: number
  text: string | null
}

export const MIN_RATING = 1
export const MAX_RATING = 5

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

export function parseRateVendorInput(raw: unknown): RateVendorInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventReviewValidationError('Некорректные данные отзыва')
  }

  const data = raw as Record<string, unknown>
  const vendorId = cleanString(data.vendorId)

  if (!vendorId) {
    throw new EventReviewValidationError('Выберите подрядчика')
  }

  const rating = typeof data.rating === 'string' ? Number(data.rating) : data.rating

  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    throw new EventReviewValidationError(`Оценка должна быть от ${MIN_RATING} до ${MAX_RATING}`)
  }

  return { vendorId, rating, text: cleanString(data.text) ?? null }
}
