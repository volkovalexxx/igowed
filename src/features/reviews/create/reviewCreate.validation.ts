export class ReviewValidationError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'ReviewValidationError'
    this.status = status
  }
}

export const MIN_RATING = 1
export const MAX_RATING = 5
export const MAX_TEXT_LENGTH = 2000

export type CreateReviewInput = {
  vendorSlug: string
  rating: number
  text: string | null
}

function cleanString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

/** Разбирает тело POST /api/reviews: slug подрядчика, оценка 1–5, необязательный текст. */
export function parseCreateReviewInput(raw: unknown): CreateReviewInput {
  if (!raw || typeof raw !== 'object') {
    throw new ReviewValidationError('Некорректные данные отзыва')
  }

  const data = raw as Record<string, unknown>

  const vendorSlug = cleanString(data.vendorSlug)
  if (!vendorSlug) {
    throw new ReviewValidationError('Не указан подрядчик')
  }

  const rating = typeof data.rating === 'string' ? Number(data.rating) : data.rating
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
    throw new ReviewValidationError(`Оценка должна быть от ${MIN_RATING} до ${MAX_RATING}`)
  }

  const text = cleanString(data.text)
  if (text && text.length > MAX_TEXT_LENGTH) {
    throw new ReviewValidationError('Отзыв слишком длинный')
  }

  return { vendorSlug, rating, text: text ?? null }
}
