import { describe, expect, it } from 'vitest'
import {
  ALLOWED_TRANSITIONS,
  canTransition,
  countByStatus,
  filterByStatus,
  formatOrderDate,
} from './orders.format'
import type { VendorOrder } from './orders.types'

function order(id: string, status: VendorOrder['status']): VendorOrder {
  return { id, clientId: 'u', clientName: 'A', clientContact: 'a@b.c', clientAvatar: null, date: null, message: null, status }
}

describe('formatOrderDate', () => {
  it('formats an ISO date in Russian without the trailing year mark', () => {
    expect(formatOrderDate('2026-06-14T00:00:00.000Z')).toBe('14 июня 2026')
  })

  it('handles a missing date', () => {
    expect(formatOrderDate(null)).toBe('Дата не указана')
  })

  it('handles an unparseable date', () => {
    expect(formatOrderDate('not-a-date')).toBe('Дата не указана')
  })
})

describe('canTransition', () => {
  it('allows accepting or declining a pending order', () => {
    expect(canTransition('PENDING', 'CONFIRMED')).toBe(true)
    expect(canTransition('PENDING', 'CANCELLED')).toBe(true)
  })

  it('allows completing or cancelling a confirmed order', () => {
    expect(canTransition('CONFIRMED', 'COMPLETED')).toBe(true)
    expect(canTransition('CONFIRMED', 'CANCELLED')).toBe(true)
  })

  it('forbids skipping straight from pending to completed', () => {
    expect(canTransition('PENDING', 'COMPLETED')).toBe(false)
  })

  it('treats completed and cancelled as terminal', () => {
    expect(ALLOWED_TRANSITIONS.COMPLETED).toHaveLength(0)
    expect(ALLOWED_TRANSITIONS.CANCELLED).toHaveLength(0)
    expect(canTransition('COMPLETED', 'CONFIRMED')).toBe(false)
    expect(canTransition('CANCELLED', 'PENDING')).toBe(false)
  })
})

describe('filterByStatus / countByStatus', () => {
  const orders = [order('1', 'PENDING'), order('2', 'PENDING'), order('3', 'CONFIRMED')]

  it('filters to a single status', () => {
    expect(filterByStatus(orders, 'PENDING').map((o) => o.id)).toEqual(['1', '2'])
  })

  it('counts a single status', () => {
    expect(countByStatus(orders, 'PENDING')).toBe(2)
    expect(countByStatus(orders, 'CONFIRMED')).toBe(1)
    expect(countByStatus(orders, 'CANCELLED')).toBe(0)
  })
})
