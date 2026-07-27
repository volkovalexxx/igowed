import { describe, expect, it } from 'vitest'
import { headerInitial, toHeaderViewer } from './header.helpers'

describe('toHeaderViewer', () => {
  it('returns null for a missing session', () => {
    expect(toHeaderViewer(null)).toBeNull()
    expect(toHeaderViewer({})).toBeNull()
    expect(toHeaderViewer({ user: null })).toBeNull()
  })

  it('returns null when there is no user id', () => {
    expect(toHeaderViewer({ user: { name: 'Аня' } })).toBeNull()
  })

  it('maps an authenticated session to name and role', () => {
    expect(toHeaderViewer({ user: { id: 'u1', name: 'Аня', role: 'CLIENT' } })).toEqual({ name: 'Аня', role: 'CLIENT' })
  })

  it('tolerates a user without a name', () => {
    expect(toHeaderViewer({ user: { id: 'u1', role: 'VENDOR' } })).toEqual({ name: null, role: 'VENDOR' })
  })
})

describe('headerInitial', () => {
  it('takes the first letter, uppercased', () => {
    expect(headerInitial('ольга')).toBe('О')
    expect(headerInitial('  Иван ')).toBe('И')
  })

  it('falls back for empty names', () => {
    expect(headerInitial(null)).toBe('·')
    expect(headerInitial('   ')).toBe('·')
  })
})
