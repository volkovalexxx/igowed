import { describe, expect, it } from 'vitest'
import { getPostAuthRedirect, getRoleHomePath, getSafeNextPath } from './authRedirect'

describe('auth redirects', () => {
  it('routes vendors to the vendor dashboard by default', () => {
    expect(getRoleHomePath('VENDOR')).toBe('/dashboard/profile')
  })

  it('routes clients to events by default', () => {
    expect(getRoleHomePath('CLIENT')).toBe('/event')
    expect(getRoleHomePath(undefined)).toBe('/event')
  })

  it('allows only internal next paths', () => {
    expect(getSafeNextPath('/event/one/tasks')).toBe('/event/one/tasks')
    expect(getSafeNextPath('https://example.com')).toBeNull()
    expect(getSafeNextPath('//example.com')).toBeNull()
    expect(getSafeNextPath('/login')).toBeNull()
  })

  it('prefers safe next paths over role defaults', () => {
    expect(getPostAuthRedirect('VENDOR', '/event/new')).toBe('/event/new')
    expect(getPostAuthRedirect('VENDOR', 'https://example.com')).toBe('/dashboard/profile')
  })
})
