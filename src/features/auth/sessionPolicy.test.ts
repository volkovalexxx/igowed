import { describe, expect, it } from 'vitest'
import { isSessionRefreshDue, sessionUpdateAgeSeconds } from './sessionPolicy'

describe('session policy', () => {
  it('refreshes tokens without a refresh timestamp', () => {
    expect(isSessionRefreshDue(undefined)).toBe(true)
  })

  it('keeps a recently refreshed token', () => {
    const now = 1_000_000
    expect(isSessionRefreshDue(now - 1_000, now)).toBe(false)
  })

  it('refreshes a stale token', () => {
    const now = 1_000_000_000
    expect(isSessionRefreshDue(now - sessionUpdateAgeSeconds * 1000, now)).toBe(true)
  })
})
