import type { CreatedBooking } from '../booking.types'
import { BookingValidationError, parseCreateBookingInput } from './booking.validation'

export type BookingVendor = {
  id: string
  userId: string
}

type BookingDeps = {
  findVendorBySlug(slug: string): Promise<BookingVendor | null>
  findActiveBooking(userId: string, vendorId: string): Promise<{ id: string; status: CreatedBooking['status'] } | null>
  createBooking(userId: string, vendorId: string, date: string | null, message: string | null): Promise<{ id: string; status: CreatedBooking['status'] }>
}

/**
 * Создаёт заявку от клиента подрядчику. Нельзя бронировать самого себя; повторная активная
 * заявка (PENDING/CONFIRMED) тому же подрядчику не плодится — возвращается существующая.
 */
export async function createBooking(userId: string, rawInput: unknown, deps: BookingDeps): Promise<CreatedBooking> {
  if (!userId) {
    throw new BookingValidationError('Требуется авторизация')
  }

  const input = parseCreateBookingInput(rawInput)

  const vendor = await deps.findVendorBySlug(input.vendorSlug)
  if (!vendor) {
    throw new BookingValidationError('Подрядчик не найден')
  }

  if (vendor.userId === userId) {
    throw new BookingValidationError('Нельзя оставить заявку самому себе')
  }

  const active = await deps.findActiveBooking(userId, vendor.id)
  if (active) {
    return { id: active.id, status: active.status, existing: true }
  }

  const booking = await deps.createBooking(userId, vendor.id, input.date, input.message)
  return { id: booking.id, status: booking.status, existing: false }
}

export function isBookingError(error: unknown): error is BookingValidationError {
  return error instanceof BookingValidationError
}
