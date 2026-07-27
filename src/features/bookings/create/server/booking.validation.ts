import type { CreateBookingInput } from '../booking.types'

export class BookingValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'BookingValidationError'
  }
}

const MAX_MESSAGE_LENGTH = 2000

/**
 * Разбирает тело POST /api/bookings: обязателен slug подрядчика, дата и сообщение опциональны.
 * Дата, если передана, должна быть валидной; сообщение обрезается и ограничено по длине.
 */
export function parseCreateBookingInput(raw: unknown): CreateBookingInput {
  if (!raw || typeof raw !== 'object') {
    throw new BookingValidationError('Некорректные данные заявки')
  }

  const source = raw as Record<string, unknown>

  const vendorSlug = source.vendorSlug
  if (typeof vendorSlug !== 'string' || vendorSlug.trim().length === 0) {
    throw new BookingValidationError('Не указан подрядчик')
  }

  let date: string | null = null
  if (source.date != null && source.date !== '') {
    if (typeof source.date !== 'string' || Number.isNaN(new Date(source.date).getTime())) {
      throw new BookingValidationError('Некорректная дата')
    }
    date = new Date(source.date).toISOString()
  }

  let message: string | null = null
  if (source.message != null && source.message !== '') {
    if (typeof source.message !== 'string') {
      throw new BookingValidationError('Некорректное сообщение')
    }
    const trimmed = source.message.trim()
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      throw new BookingValidationError('Сообщение слишком длинное')
    }
    message = trimmed.length > 0 ? trimmed : null
  }

  return { vendorSlug: vendorSlug.trim(), date, message }
}
