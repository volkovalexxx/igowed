import { describe, expect, it, vi } from 'vitest'
import { AccountValidationError } from '../account.errors'
import { changePassword } from './accountSecurity.service'

function makeDeps(overrides: Partial<Parameters<typeof changePassword>[2]> = {}) {
  return {
    findPasswordHash: vi.fn(async (): Promise<string | null> => 'hash-of-current'),
    verifyPassword: vi.fn(async () => true),
    hashPassword: vi.fn(async (plain: string) => `hashed:${plain}`),
    updatePassword: vi.fn(async () => {}),
    ...overrides,
  }
}

const validInput = { currentPassword: 'old-pass-1', newPassword: 'new-pass-12', confirmPassword: 'new-pass-12' }

describe('changePassword', () => {
  it('requires an authenticated user', async () => {
    const deps = makeDeps()
    await expect(changePassword('', validInput, deps)).rejects.toMatchObject({ status: 401 })
    expect(deps.findPasswordHash).not.toHaveBeenCalled()
  })

  it('rejects a short new password', async () => {
    const deps = makeDeps()
    await expect(
      changePassword('u1', { currentPassword: 'old-pass-1', newPassword: 'short', confirmPassword: 'short' }, deps),
    ).rejects.toThrow('не менее 8')
  })

  it('rejects a mismatched confirmation', async () => {
    const deps = makeDeps()
    await expect(
      changePassword('u1', { currentPassword: 'old-pass-1', newPassword: 'new-pass-12', confirmPassword: 'nope-pass-12' }, deps),
    ).rejects.toThrow('не совпадают')
  })

  it('rejects reusing the current password', async () => {
    const deps = makeDeps()
    await expect(
      changePassword('u1', { currentPassword: 'same-pass-1', newPassword: 'same-pass-1', confirmPassword: 'same-pass-1' }, deps),
    ).rejects.toThrow('совпадает с текущим')
  })

  it('fails for accounts without a password', async () => {
    const deps = makeDeps({ findPasswordHash: vi.fn(async () => null) })
    await expect(changePassword('u1', validInput, deps)).rejects.toThrow('нет пароля')
    expect(deps.updatePassword).not.toHaveBeenCalled()
  })

  it('rejects a wrong current password with 403', async () => {
    const deps = makeDeps({ verifyPassword: vi.fn(async () => false) })
    await expect(changePassword('u1', validInput, deps)).rejects.toMatchObject({ status: 403 })
    expect(deps.updatePassword).not.toHaveBeenCalled()
  })

  it('hashes and stores the new password on success', async () => {
    const deps = makeDeps()
    await changePassword('u1', validInput, deps)
    expect(deps.verifyPassword).toHaveBeenCalledWith('old-pass-1', 'hash-of-current')
    expect(deps.hashPassword).toHaveBeenCalledWith('new-pass-12')
    expect(deps.updatePassword).toHaveBeenCalledWith('u1', 'hashed:new-pass-12')
  })

  it('throws AccountValidationError instances', async () => {
    const deps = makeDeps({ findPasswordHash: vi.fn(async () => null) })
    await expect(changePassword('u1', validInput, deps)).rejects.toBeInstanceOf(AccountValidationError)
  })
})
