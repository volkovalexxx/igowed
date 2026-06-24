import { describe, expect, it } from 'vitest'
import { parseRegisterInput, RegisterValidationError } from './register.validation'

describe('parseRegisterInput', () => {
  it('normalizes email, name, and optional fields', () => {
    expect(
      parseRegisterInput({
        email: ' USER@Example.COM ',
        password: 'password123',
        name: '  Анна   Волкова  ',
        role: 'CLIENT',
        city: ' Минск ',
        category: '',
      })
    ).toEqual({
      email: 'user@example.com',
      password: 'password123',
      name: 'Анна Волкова',
      role: 'CLIENT',
      city: 'Минск',
      category: undefined,
    })
  })

  it('rejects invalid email values', () => {
    expect(() =>
      parseRegisterInput({
        email: 'bad-email',
        password: 'password123',
        name: 'Анна',
        role: 'CLIENT',
      })
    ).toThrow(RegisterValidationError)
  })

  it('rejects short passwords', () => {
    expect(() =>
      parseRegisterInput({
        email: 'user@example.com',
        password: '123',
        name: 'Анна',
        role: 'CLIENT',
      })
    ).toThrow('Пароль должен содержать минимум 8 символов')
  })

  it('rejects unsupported roles', () => {
    expect(() =>
      parseRegisterInput({
        email: 'user@example.com',
        password: 'password123',
        name: 'Анна',
        role: 'MANAGER',
      })
    ).toThrow('Недопустимое значение role')
  })
})
