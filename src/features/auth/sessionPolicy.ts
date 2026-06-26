export const sessionMaxAgeSeconds = 60 * 60 * 24 * 30
export const sessionUpdateAgeSeconds = 60 * 60 * 6

export function isSessionRefreshDue(refreshedAt: unknown, now = Date.now()) {
  if (typeof refreshedAt !== 'number') return true
  return now - refreshedAt >= sessionUpdateAgeSeconds * 1000
}
