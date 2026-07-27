import type { OrderStatus } from '../orders.types'

export class OrdersValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'OrdersValidationError'
  }
}

const SETTABLE_STATUSES: OrderStatus[] = ['CONFIRMED', 'COMPLETED', 'CANCELLED']

export type UpdateStatusInput = {
  status: OrderStatus
}

/** Разбирает тело PATCH-запроса: разрешает выставлять только целевые статусы, не сам PENDING. */
export function parseUpdateStatusInput(raw: unknown): UpdateStatusInput {
  if (!raw || typeof raw !== 'object') {
    throw new OrdersValidationError('Некорректные данные заявки')
  }

  const status = (raw as Record<string, unknown>).status
  if (typeof status !== 'string' || !SETTABLE_STATUSES.includes(status as OrderStatus)) {
    throw new OrdersValidationError('Недопустимый статус заявки')
  }

  return { status: status as OrderStatus }
}
