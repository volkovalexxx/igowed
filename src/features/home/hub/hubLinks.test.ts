import { describe, expect, it } from 'vitest'
import { greetingName, hubLinksForRole, hubRoleLabel } from './hubLinks'

describe('hubLinksForRole', () => {
  it('gives vendors their dashboard links', () => {
    const hrefs = hubLinksForRole('VENDOR').map((link) => link.href)
    expect(hrefs).toContain('/dashboard/orders')
    expect(hrefs).toContain('/dashboard/gallery')
  })

  it('gives admins the moderation link', () => {
    expect(hubLinksForRole('ADMIN').map((link) => link.href)).toContain('/admin')
  })

  it('gives clients their booking and catalog links', () => {
    const hrefs = hubLinksForRole('CLIENT').map((link) => link.href)
    expect(hrefs).toContain('/bookings')
    expect(hrefs).toContain('/catalog')
  })

  it('treats an unknown or missing role as client', () => {
    expect(hubLinksForRole('WEIRD')).toEqual(hubLinksForRole('CLIENT'))
    expect(hubLinksForRole(null)).toEqual(hubLinksForRole('CLIENT'))
    expect(hubLinksForRole(undefined)).toEqual(hubLinksForRole('CLIENT'))
  })

  it('never returns an empty list', () => {
    for (const role of ['VENDOR', 'ADMIN', 'CLIENT', 'x', null]) {
      expect(hubLinksForRole(role).length).toBeGreaterThan(0)
    }
  })
})

describe('hubRoleLabel', () => {
  it('labels each known role', () => {
    expect(hubRoleLabel('VENDOR')).toBe('Подрядчик')
    expect(hubRoleLabel('ADMIN')).toBe('Администратор')
    expect(hubRoleLabel('CLIENT')).toBe('Клиент')
  })

  it('defaults unknown roles to client', () => {
    expect(hubRoleLabel(undefined)).toBe('Клиент')
  })
})

describe('greetingName', () => {
  it('trims a real name', () => {
    expect(greetingName('  Ольга  ')).toBe('Ольга')
  })

  it('returns null for empty or missing names', () => {
    expect(greetingName('')).toBeNull()
    expect(greetingName('   ')).toBeNull()
    expect(greetingName(null)).toBeNull()
    expect(greetingName(undefined)).toBeNull()
  })
})
