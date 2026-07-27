import { describe, expect, it, vi } from 'vitest'
import { AccountValidationError } from '../account.errors'
import { deleteAccount } from './accountDelete.service'

function makeDeps(overrides: Partial<Parameters<typeof deleteAccount>[2]> = {}) {
  return {
    deleteUser: vi.fn(async () => ({ count: 1 })),
    ...overrides,
  }
}

describe('deleteAccount', () => {
  it('requires an authenticated user', async () => {
    const deps = makeDeps()
    await expect(deleteAccount('', { confirm: 'УДАЛИТЬ' }, deps)).rejects.toMatchObject({ status: 401 })
    expect(deps.deleteUser).not.toHaveBeenCalled()
  })

  it('rejects a wrong confirmation word', async () => {
    const deps = makeDeps()
    await expect(deleteAccount('u1', { confirm: 'удалить' }, deps)).rejects.toBeInstanceOf(AccountValidationError)
    await expect(deleteAccount('u1', { confirm: 'delete' }, deps)).rejects.toThrow('подтверждения')
    expect(deps.deleteUser).not.toHaveBeenCalled()
  })

  it('accepts the confirmation word with surrounding whitespace', async () => {
    const deps = makeDeps()
    await deleteAccount('u1', { confirm: '  УДАЛИТЬ  ' }, deps)
    expect(deps.deleteUser).toHaveBeenCalledWith('u1')
  })

  it('throws 404 when the user is already gone', async () => {
    const deps = makeDeps({ deleteUser: vi.fn(async () => ({ count: 0 })) })
    await expect(deleteAccount('u1', { confirm: 'УДАЛИТЬ' }, deps)).rejects.toMatchObject({ status: 404 })
  })

  it('deletes the account on valid confirmation', async () => {
    const deps = makeDeps()
    await expect(deleteAccount('u1', { confirm: 'УДАЛИТЬ' }, deps)).resolves.toBeUndefined()
    expect(deps.deleteUser).toHaveBeenCalledWith('u1')
  })
})
