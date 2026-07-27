import { canTransition } from '@/features/vendors/orders/orders.format'
import type { OrderStatus } from '@/features/vendors/orders/orders.types'
import type { ClientBooking } from '../clientBooking.types'

export class ClientBookingError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'ClientBookingError'
    this.status = status
  }
}

type ClientBookingsDeps = {
  listByUser(userId: string): Promise<ClientBooking[]>
  findStatusOwnedByUser(userId: string, bookingId: string): Promise<OrderStatus | null>
  cancelOwnedByUser(userId: string, bookingId: string): Promise<{ count: number }>
}

/** Заявки клиента, отсортированные и с пометкой отзыва (её проставляет репозиторий). */
export async function listClientBookings(userId: string, deps: ClientBookingsDeps): Promise<ClientBooking[]> {
  if (!userId) return []
  return deps.listByUser(userId)
}

/** Клиент может отменить только свою заявку и только из активного статуса (PENDING/CONFIRMED). */
export async function cancelClientBooking(userId: string, bookingId: string, deps: ClientBookingsDeps): Promise<{ status: OrderStatus }> {
  if (!userId) {
    throw new ClientBookingError('Требуется авторизация', 401)
  }
  if (!bookingId) {
    throw new ClientBookingError('Заявка не указана')
  }

  const current = await deps.findStatusOwnedByUser(userId, bookingId)
  if (!current) {
    throw new ClientBookingError('Заявка не найдена', 404)
  }

  if (current === 'CANCELLED') {
    return { status: 'CANCELLED' }
  }

  if (!canTransition(current, 'CANCELLED')) {
    throw new ClientBookingError('Эту заявку уже нельзя отменить')
  }

  const result = await deps.cancelOwnedByUser(userId, bookingId)
  if (result.count < 1) {
    throw new ClientBookingError('Заявка не найдена', 404)
  }

  return { status: 'CANCELLED' }
}

export function isClientBookingError(error: unknown): error is ClientBookingError {
  return error instanceof ClientBookingError
}
