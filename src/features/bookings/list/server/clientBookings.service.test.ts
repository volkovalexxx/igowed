import { describe, expect, it, vi } from 'vitest'
import type { OrderStatus } from '@/features/vendors/orders/orders.types'
import type { ClientBooking } from '../clientBooking.types'
import { cancelClientBooking, ClientBookingError, isClientBookingError, listClientBookings } from './clientBookings.service'

function makeDeps(overrides: Partial<Parameters<typeof cancelClientBooking>[2]> = {}) {
  return {
    listByUser: vi.fn(async (): Promise<ClientBooking[]> => []),
    findStatusOwnedByUser: vi.fn(async (): Promise<OrderStatus | null> => 'PENDING'),
    cancelOwnedByUser: vi.fn(async () => ({ count: 1 })),
    ...overrides,
  }
}

describe('listClientBookings', () => {
  it('returns [] for an empty user id without hitting the repository', async () => {
    const deps = makeDeps()
    expect(await listClientBookings('', deps)).toEqual([])
    expect(deps.listByUser).not.toHaveBeenCalled()
  })

  it('delegates to the repository for a real user', async () => {
    const rows: ClientBooking[] = [
      { id: 'b1', vendorName: 'A', vendorAvatar: null, vendorSlug: 'a', date: null, message: null, status: 'PENDING', alreadyReviewed: false },
    ]
    const deps = makeDeps({ listByUser: vi.fn(async () => rows) })
    expect(await listClientBookings('u1', deps)).toBe(rows)
    expect(deps.listByUser).toHaveBeenCalledWith('u1')
  })
})

describe('cancelClientBooking', () => {
  it('requires an authenticated user', async () => {
    const deps = makeDeps()
    await expect(cancelClientBooking('', 'b1', deps)).rejects.toMatchObject({ status: 401 })
    expect(deps.findStatusOwnedByUser).not.toHaveBeenCalled()
  })

  it('404s when the booking is not owned by the user', async () => {
    const deps = makeDeps({ findStatusOwnedByUser: vi.fn(async () => null) })
    await expect(cancelClientBooking('u1', 'b1', deps)).rejects.toMatchObject({ status: 404 })
    expect(deps.cancelOwnedByUser).not.toHaveBeenCalled()
  })

  it('cancels a pending booking', async () => {
    const deps = makeDeps({ findStatusOwnedByUser: vi.fn(async (): Promise<OrderStatus | null> => 'PENDING') })
    expect(await cancelClientBooking('u1', 'b1', deps)).toEqual({ status: 'CANCELLED' })
    expect(deps.cancelOwnedByUser).toHaveBeenCalledWith('u1', 'b1')
  })

  it('cancels a confirmed booking', async () => {
    const deps = makeDeps({ findStatusOwnedByUser: vi.fn(async (): Promise<OrderStatus | null> => 'CONFIRMED') })
    expect(await cancelClientBooking('u1', 'b1', deps)).toEqual({ status: 'CANCELLED' })
  })

  it('refuses to cancel a completed booking', async () => {
    const deps = makeDeps({ findStatusOwnedByUser: vi.fn(async (): Promise<OrderStatus | null> => 'COMPLETED') })
    await expect(cancelClientBooking('u1', 'b1', deps)).rejects.toThrow('нельзя отменить')
    expect(deps.cancelOwnedByUser).not.toHaveBeenCalled()
  })

  it('is idempotent for an already-cancelled booking', async () => {
    const deps = makeDeps({ findStatusOwnedByUser: vi.fn(async (): Promise<OrderStatus | null> => 'CANCELLED') })
    expect(await cancelClientBooking('u1', 'b1', deps)).toEqual({ status: 'CANCELLED' })
    expect(deps.cancelOwnedByUser).not.toHaveBeenCalled()
  })
})

describe('isClientBookingError', () => {
  it('detects its own errors', () => {
    expect(isClientBookingError(new ClientBookingError('x'))).toBe(true)
    expect(isClientBookingError(new Error('x'))).toBe(false)
  })
})
