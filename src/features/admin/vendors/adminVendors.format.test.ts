import { describe, expect, it } from 'vitest'
import { formatJoinDate, summarizeVendors } from './adminVendors.format'
import type { AdminVendorRow } from './adminVendors.types'

function row(overrides: Partial<AdminVendorRow>): AdminVendorRow {
  return {
    id: 'v',
    name: 'A',
    username: '@a',
    slug: 'a',
    city: 'Минск',
    isPro: false,
    isVerified: false,
    isActive: true,
    reviewCount: 0,
    rating: 0,
    createdAt: '2026-06-05T00:00:00.000Z',
    ...overrides,
  }
}

describe('formatJoinDate', () => {
  it('formats an ISO date', () => {
    expect(formatJoinDate('2026-06-05T00:00:00.000Z')).toBe('5 июн. 2026')
  })

  it('handles an invalid date', () => {
    expect(formatJoinDate('nope')).toBe('—')
  })
})

describe('summarizeVendors', () => {
  it('counts totals, verified, active and hidden', () => {
    const rows = [
      row({ isVerified: true, isActive: true }),
      row({ isVerified: false, isActive: true }),
      row({ isVerified: true, isActive: false }),
    ]
    expect(summarizeVendors(rows)).toEqual({ total: 3, verified: 2, active: 2, hidden: 1 })
  })

  it('handles an empty list', () => {
    expect(summarizeVendors([])).toEqual({ total: 0, verified: 0, active: 0, hidden: 0 })
  })
})
