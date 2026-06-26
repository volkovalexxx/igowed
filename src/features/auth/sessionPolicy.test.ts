import { describe, expect, it } from 'vitest'
import {
  accessTokenMaxAgeSeconds,
  createTokenWindow,
  isAccessTokenExpired,
  isRefreshTokenExpired,
  refreshTokenMaxAgeSeconds,
  shouldRefreshAccessToken,
} from './sessionPolicy'

describe('session policy', () => {
  it('creates a 15 minute access window and 24 hour refresh window', () => {
    const now = 1_000_000

    expect(createTokenWindow(now)).toEqual({
      accessTokenExpiresAt: now + accessTokenMaxAgeSeconds * 1000,
      refreshTokenExpiresAt: now + refreshTokenMaxAgeSeconds * 1000,
    })
  })

  it('detects expired access tokens', () => {
    const now = 1_000_000

    expect(isAccessTokenExpired(now + 1, now)).toBe(false)
    expect(isAccessTokenExpired(now, now)).toBe(true)
    expect(isAccessTokenExpired(undefined, now)).toBe(true)
  })

  it('detects expired refresh tokens', () => {
    const now = 1_000_000

    expect(isRefreshTokenExpired(now + 1, now)).toBe(false)
    expect(isRefreshTokenExpired(now, now)).toBe(true)
    expect(isRefreshTokenExpired(undefined, now)).toBe(true)
  })

  it('refreshes access tokens only while the refresh token is valid', () => {
    const now = 1_000_000

    expect(shouldRefreshAccessToken(now - 1, now + 1, now)).toBe(true)
    expect(shouldRefreshAccessToken(now - 1, now, now)).toBe(false)
    expect(shouldRefreshAccessToken(now + 1, now + 1, now)).toBe(false)
  })
})
