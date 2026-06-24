import { describe, expect, it, vi } from 'vitest'
import { createRegisterAccount, RegisterConflictError } from './register.service'
import type { RegisterDeps } from './register.types'

function createDeps(overrides: Partial<RegisterDeps> = {}): RegisterDeps {
  return {
    hashPassword: vi.fn(async (password) => `hashed:${password}`),
    findUserByEmail: vi.fn(async () => null),
    createUser: vi.fn(async (input) => ({
      id: 'user_12345678',
      email: input.email,
      name: input.name,
      role: input.role,
      createdAt: new Date('2026-06-24T00:00:00.000Z'),
    })),
    findVendorBySlug: vi.fn(async () => null),
    findVendorByUsername: vi.fn(async () => null),
    createVendor: vi.fn(async () => undefined),
    ...overrides,
  }
}

describe('createRegisterAccount', () => {
  it('creates a client user with a hashed password', async () => {
    const deps = createDeps()

    const user = await createRegisterAccount(
      {
        email: 'client@example.com',
        password: 'password123',
        name: 'Анна Волкова',
        role: 'CLIENT',
      },
      deps
    )

    expect(user.email).toBe('client@example.com')
    expect(deps.createUser).toHaveBeenCalledWith({
      email: 'client@example.com',
      password: 'hashed:password123',
      name: 'Анна Волкова',
      role: 'CLIENT',
    })
    expect(deps.createVendor).not.toHaveBeenCalled()
  })

  it('creates a vendor profile with unique slug and username', async () => {
    const deps = createDeps({
      findVendorBySlug: vi.fn(async (slug) => (slug === 'иван-петров' ? { id: 'vendor-1' } : null)),
      findVendorByUsername: vi.fn(async (username) => (username === 'иван_петров' ? { id: 'vendor-1' } : null)),
    })

    await createRegisterAccount(
      {
        email: 'vendor@example.com',
        password: 'password123',
        name: 'Иван Петров',
        role: 'VENDOR',
        category: 'Фотограф',
        city: 'Минск',
      },
      deps
    )

    expect(deps.createVendor).toHaveBeenCalledWith({
      userId: 'user_12345678',
      slug: 'иван-петров-1',
      firstName: 'Иван',
      lastName: 'Петров',
      username: 'иван_петров_1',
      cities: ['Минск'],
      businessType: 'Фотограф',
    })
  })

  it('rejects duplicate email addresses', async () => {
    const deps = createDeps({
      findUserByEmail: vi.fn(async () => ({ id: 'existing' })),
    })

    await expect(
      createRegisterAccount(
        {
          email: 'client@example.com',
          password: 'password123',
          name: 'Анна Волкова',
          role: 'CLIENT',
        },
        deps
      )
    ).rejects.toThrow(RegisterConflictError)

    expect(deps.createUser).not.toHaveBeenCalled()
  })
})
