export const accessTokenMaxAgeSeconds = 60 * 15
export const refreshTokenMaxAgeSeconds = 60 * 60 * 24

export function createTokenWindow(now = Date.now()) {
  return {
    accessTokenExpiresAt: now + accessTokenMaxAgeSeconds * 1000,
    refreshTokenExpiresAt: now + refreshTokenMaxAgeSeconds * 1000,
  }
}

export function isAccessTokenExpired(accessTokenExpiresAt: unknown, now = Date.now()) {
  return typeof accessTokenExpiresAt !== 'number' || now >= accessTokenExpiresAt
}

export function isRefreshTokenExpired(refreshTokenExpiresAt: unknown, now = Date.now()) {
  return typeof refreshTokenExpiresAt !== 'number' || now >= refreshTokenExpiresAt
}

export function shouldRefreshAccessToken(accessTokenExpiresAt: unknown, refreshTokenExpiresAt: unknown, now = Date.now()) {
  return isAccessTokenExpired(accessTokenExpiresAt, now) && !isRefreshTokenExpired(refreshTokenExpiresAt, now)
}
