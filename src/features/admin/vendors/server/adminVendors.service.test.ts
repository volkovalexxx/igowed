import { describe, expect, it, vi } from 'vitest'
import type { AdminVendorRow } from '../adminVendors.types'
import { assertAdmin, isAdminError, listAdminVendors, toggleVendorFlag } from './adminVendors.service'
import { AdminValidationError } from './adminVendors.validation'

function makeDeps(overrides: Partial<Parameters<typeof listAdminVendors>[1]> = {}) {
  return {
    listVendors: vi.fn(async (): Promise<AdminVendorRow[]> => []),
    setFlag: vi.fn(async () => ({ count: 1 })),
    ...overrides,
  }
}

describe('assertAdmin', () => {
  it('passes for ADMIN', () => {
    expect(() => assertAdmin('ADMIN')).not.toThrow()
  })

  it('throws 403 for other roles and undefined', () => {
    expect(() => assertAdmin('VENDOR')).toThrow(AdminValidationError)
    try {
      assertAdmin('CLIENT')
    } catch (error) {
      expect((error as AdminValidationError).status).toBe(403)
    }
    expect(() => assertAdmin(undefined)).toThrow('администратора')
  })
})

describe('listAdminVendors', () => {
  it('denies non-admins before touching the repository', async () => {
    const deps = makeDeps()
    await expect(listAdminVendors('CLIENT', deps)).rejects.toMatchObject({ status: 403 })
    expect(deps.listVendors).not.toHaveBeenCalled()
  })

  it('returns rows for an admin', async () => {
    const rows: AdminVendorRow[] = []
    const deps = makeDeps({ listVendors: vi.fn(async () => rows) })
    expect(await listAdminVendors('ADMIN', deps)).toBe(rows)
  })
})

describe('toggleVendorFlag', () => {
  it('denies non-admins', async () => {
    const deps = makeDeps()
    await expect(toggleVendorFlag('VENDOR', 'v1', { flag: 'verified', value: true }, deps)).rejects.toMatchObject({ status: 403 })
    expect(deps.setFlag).not.toHaveBeenCalled()
  })

  it('rejects an unknown flag', async () => {
    const deps = makeDeps()
    await expect(toggleVendorFlag('ADMIN', 'v1', { flag: 'nope', value: true }, deps)).rejects.toThrow('Недопустимый флаг')
  })

  it('rejects a non-boolean value', async () => {
    const deps = makeDeps()
    await expect(toggleVendorFlag('ADMIN', 'v1', { flag: 'active', value: 'yes' }, deps)).rejects.toThrow('булевым')
  })

  it('sets a flag for an existing vendor', async () => {
    const deps = makeDeps()
    expect(await toggleVendorFlag('ADMIN', 'v1', { flag: 'verified', value: true }, deps)).toEqual({ flag: 'verified', value: true })
    expect(deps.setFlag).toHaveBeenCalledWith('v1', 'verified', true)
  })

  it('throws 404 when the vendor is missing', async () => {
    const deps = makeDeps({ setFlag: vi.fn(async () => ({ count: 0 })) })
    await expect(toggleVendorFlag('ADMIN', 'ghost', { flag: 'active', value: false }, deps)).rejects.toMatchObject({ status: 404 })
  })
})

describe('isAdminError', () => {
  it('detects admin errors', () => {
    expect(isAdminError(new AdminValidationError('x'))).toBe(true)
    expect(isAdminError(new Error('x'))).toBe(false)
  })
})
