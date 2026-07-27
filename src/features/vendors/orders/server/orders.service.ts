import { canTransition } from '../orders.format'
import type { OrderStatus, VendorOrder } from '../orders.types'
import { OrdersValidationError, parseUpdateStatusInput } from './orders.validation'

type OrdersDeps = {
  findVendorIdForUser(userId: string): Promise<string | null>
  listByVendor(vendorId: string): Promise<VendorOrder[]>
  findStatusOwned(vendorId: string, bookingId: string): Promise<OrderStatus | null>
  updateStatusOwned(vendorId: string, bookingId: string, status: OrderStatus): Promise<{ count: number }>
}

async function requireVendorId(userId: string, deps: OrdersDeps): Promise<string> {
  const vendorId = await deps.findVendorIdForUser(userId)
  if (!vendorId) {
    throw new OrdersValidationError('Профиль подрядчика не найден')
  }
  return vendorId
}

export async function listOrders(userId: string, deps: OrdersDeps): Promise<VendorOrder[]> {
  if (!userId) return []

  const vendorId = await deps.findVendorIdForUser(userId)
  if (!vendorId) return []

  return deps.listByVendor(vendorId)
}

export async function updateOrderStatus(
  userId: string,
  bookingId: string,
  rawInput: unknown,
  deps: OrdersDeps,
): Promise<{ status: OrderStatus }> {
  const { status } = parseUpdateStatusInput(rawInput)
  const vendorId = await requireVendorId(userId, deps)

  const current = await deps.findStatusOwned(vendorId, bookingId)
  if (!current) {
    throw new OrdersValidationError('Заявка не найдена')
  }

  if (current === status) {
    return { status }
  }

  if (!canTransition(current, status)) {
    throw new OrdersValidationError('Недопустимый переход статуса')
  }

  const result = await deps.updateStatusOwned(vendorId, bookingId, status)
  if (result.count < 1) {
    throw new OrdersValidationError('Заявка не найдена')
  }

  return { status }
}

export function isOrdersError(error: unknown): error is OrdersValidationError {
  return error instanceof OrdersValidationError
}
