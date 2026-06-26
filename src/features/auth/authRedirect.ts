export const vendorHomePath = '/dashboard/profile'
export const clientHomePath = '/event'

export function getRoleHomePath(role: unknown) {
  return role === 'VENDOR' ? vendorHomePath : clientHomePath
}

export function getSafeNextPath(next: unknown) {
  if (typeof next !== 'string') return null
  if (!next.startsWith('/') || next.startsWith('//')) return null
  if (next.startsWith('/login') || next.startsWith('/register')) return null
  return next
}

export function getPostAuthRedirect(role: unknown, next?: unknown) {
  return getSafeNextPath(next) ?? getRoleHomePath(role)
}
