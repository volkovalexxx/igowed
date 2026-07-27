import { describe, expect, it, vi } from 'vitest'
import type { OrderStatus, VendorOrder } from '../orders.types'
import { isOrdersError, listOrders, updateOrderStatus } from './orders.service'
import { OrdersValidationError } from './orders.validation'

function makeDeps(overrides: Partial<Parameters<typeof listOrders>[1]> = {}) {
  return {
    findVendorIdForUser: vi.fn(async () => 'v1'),
    listByVendor: vi.fn(async (): Promise<VendorOrder[]> => []),
    findStatusOwned: vi.fn(async (): Promise<OrderStatus | null> => 'PENDING'),
    updateStatusOwned: vi.fn(async () => ({ count: 1 })),
    ...overrides,
  }
}

describe('listOrders', () => {
  it('returns [] for an empty user id without hitting the repository', async () => {
    const deps = makeDeps()
    expect(await listOrders('', deps)).toEqual([])
    expect(deps.findVendorIdForUser).not.toHaveBeenCalled()
  })

  it('returns [] when the user has no vendor profile', async () => {
    const deps = makeDeps({ findVendorIdForUser: vi.fn(async () => null) })
    expect(await listOrders('u1', deps)).toEqual([])
    expect(deps.listByVendor).not.toHaveBeenCalled()
  })

  it('lists bookings for the resolved vendor', async () => {
    const rows: VendorOrder[] = [
      { id: 'b1', clientId: 'u1', clientName: 'A', clientContact: 'a@b.c', clientAvatar: null, date: null, message: null, status: 'PENDING' },
    ]
    const deps = makeDeps({ listByVendor: vi.fn(async () => rows) })
    expect(await listOrders('u1', deps)).toBe(rows)
    expect(deps.listByVendor).toHaveBeenCalledWith('v1')
  })
})

describe('updateOrderStatus', () => {
  it('rejects an unknown target status', async () => {
    const deps = makeDeps()
    await expect(updateOrderStatus('u1', 'b1', { status: 'PENDING' }, deps)).rejects.toMatchObject({ status: 400 })
    expect(deps.updateStatusOwned).not.toHaveBeenCalled()
  })

  it('throws when the user has no vendor profile', async () => {
    const deps = makeDeps({ findVendorIdForUser: vi.fn(async () => null) })
    await expect(updateOrderStatus('u1', 'b1', { status: 'CONFIRMED' }, deps)).rejects.toMatchObject({ status: 400 })
  })

  it('throws when the booking is not owned by the vendor', async () => {
    const deps = makeDeps({ findStatusOwned: vi.fn(async () => null) })
    await expect(updateOrderStatus('u1', 'b1', { status: 'CONFIRMED' }, deps)).rejects.toThrow('Заявка не найдена')
    expect(deps.updateStatusOwned).not.toHaveBeenCalled()
  })

  it('accepts a pending booking (PENDING → CONFIRMED)', async () => {
    const deps = makeDeps({ findStatusOwned: vi.fn(async (): Promise<OrderStatus | null> => 'PENDING') })
    expect(await updateOrderStatus('u1', 'b1', { status: 'CONFIRMED' }, deps)).toEqual({ status: 'CONFIRMED' })
    expect(deps.updateStatusOwned).toHaveBeenCalledWith('v1', 'b1', 'CONFIRMED')
  })

  it('completes a confirmed booking (CONFIRMED → COMPLETED)', async () => {
    const deps = makeDeps({ findStatusOwned: vi.fn(async (): Promise<OrderStatus | null> => 'CONFIRMED') })
    expect(await updateOrderStatus('u1', 'b1', { status: 'COMPLETED' }, deps)).toEqual({ status: 'COMPLETED' })
  })

  it('rejects an illegal transition (PENDING → COMPLETED)', async () => {
    const deps = makeDeps({ findStatusOwned: vi.fn(async (): Promise<OrderStatus | null> => 'PENDING') })
    await expect(updateOrderStatus('u1', 'b1', { status: 'COMPLETED' }, deps)).rejects.toThrow('Недопустимый переход')
    expect(deps.updateStatusOwned).not.toHaveBeenCalled()
  })

  it('rejects touching a terminal booking (COMPLETED → CANCELLED)', async () => {
    const deps = makeDeps({ findStatusOwned: vi.fn(async (): Promise<OrderStatus | null> => 'COMPLETED') })
    await expect(updateOrderStatus('u1', 'b1', { status: 'CANCELLED' }, deps)).rejects.toThrow('Недопустимый переход')
  })

  it('is idempotent when the target equals the current status', async () => {
    const deps = makeDeps({ findStatusOwned: vi.fn(async (): Promise<OrderStatus | null> => 'CONFIRMED') })
    expect(await updateOrderStatus('u1', 'b1', { status: 'CONFIRMED' }, deps)).toEqual({ status: 'CONFIRMED' })
    expect(deps.updateStatusOwned).not.toHaveBeenCalled()
  })
})

describe('isOrdersError', () => {
  it('detects validation errors and rejects plain errors', () => {
    expect(isOrdersError(new OrdersValidationError('nope'))).toBe(true)
    expect(isOrdersError(new Error('x'))).toBe(false)
    expect(isOrdersError(null)).toBe(false)
  })
})
