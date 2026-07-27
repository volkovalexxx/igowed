import { describe, expect, it, vi } from 'vitest'
import type { CreatedBooking } from '../booking.types'
import { createBooking, isBookingError } from './booking.service'
import { BookingValidationError } from './booking.validation'

function makeDeps(overrides: Partial<Parameters<typeof createBooking>[2]> = {}) {
  return {
    findVendorBySlug: vi.fn(async () => ({ id: 'v1', userId: 'owner' })),
    findActiveBooking: vi.fn(async (): Promise<{ id: string; status: CreatedBooking['status'] } | null> => null),
    createBooking: vi.fn(async () => ({ id: 'b1', status: 'PENDING' as const })),
    ...overrides,
  }
}

const validInput = { vendorSlug: 'nice-photo', date: null, message: 'Привет' }

describe('createBooking', () => {
  it('requires an authenticated user', async () => {
    const deps = makeDeps()
    await expect(createBooking('', validInput, deps)).rejects.toThrow('Требуется авторизация')
    expect(deps.findVendorBySlug).not.toHaveBeenCalled()
  })

  it('rejects a missing vendor slug', async () => {
    const deps = makeDeps()
    await expect(createBooking('u1', { vendorSlug: '  ' }, deps)).rejects.toThrow('Не указан подрядчик')
  })

  it('throws when the vendor does not exist', async () => {
    const deps = makeDeps({ findVendorBySlug: vi.fn(async () => null) })
    await expect(createBooking('u1', validInput, deps)).rejects.toThrow('Подрядчик не найден')
  })

  it('forbids booking yourself', async () => {
    const deps = makeDeps({ findVendorBySlug: vi.fn(async () => ({ id: 'v1', userId: 'u1' })) })
    await expect(createBooking('u1', validInput, deps)).rejects.toThrow('самому себе')
    expect(deps.createBooking).not.toHaveBeenCalled()
  })

  it('returns the existing active booking instead of creating a duplicate', async () => {
    const deps = makeDeps({ findActiveBooking: vi.fn(async () => ({ id: 'old', status: 'CONFIRMED' as const })) })
    const result = await createBooking('u1', validInput, deps)
    expect(result).toEqual({ id: 'old', status: 'CONFIRMED', existing: true })
    expect(deps.createBooking).not.toHaveBeenCalled()
  })

  it('creates a new booking for the resolved vendor', async () => {
    const deps = makeDeps()
    const result = await createBooking('u1', { vendorSlug: 'nice-photo', date: '2026-09-01T00:00:00.000Z', message: 'Хочу съёмку' }, deps)
    expect(result).toEqual({ id: 'b1', status: 'PENDING', existing: false })
    expect(deps.createBooking).toHaveBeenCalledWith('u1', 'v1', '2026-09-01T00:00:00.000Z', 'Хочу съёмку')
  })

  it('rejects an invalid date', async () => {
    const deps = makeDeps()
    await expect(createBooking('u1', { vendorSlug: 'nice-photo', date: 'bad' }, deps)).rejects.toThrow('Некорректная дата')
  })
})

describe('isBookingError', () => {
  it('detects validation errors', () => {
    expect(isBookingError(new BookingValidationError('x'))).toBe(true)
    expect(isBookingError(new Error('x'))).toBe(false)
  })
})
