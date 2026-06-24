import type { RegisterInput, RegisterRole } from './register.types'

export class RegisterValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'RegisterValidationError'
  }
}

const roles = new Set<RegisterRole>(['CLIENT', 'VENDOR'])

function cleanOptional(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function parseRegisterInput(raw: unknown): RegisterInput {
  if (!raw || typeof raw !== 'object') {
    throw new RegisterValidationError('Некорректные данные регистрации')
  }

  const data = raw as Record<string, unknown>
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  const password = typeof data.password === 'string' ? data.password : ''
  const name = typeof data.name === 'string' ? data.name.trim().replace(/\s+/g, ' ') : ''
  const role = data.role

  if (!email || !password || !name || typeof role !== 'string') {
    throw new RegisterValidationError('Поля email, password, name и role обязательны')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RegisterValidationError('Введите корректный email')
  }

  if (password.length < 8) {
    throw new RegisterValidationError('Пароль должен содержать минимум 8 символов')
  }

  if (!roles.has(role as RegisterRole)) {
    throw new RegisterValidationError('Недопустимое значение role')
  }

  return {
    email,
    password,
    name,
    role: role as RegisterRole,
    category: cleanOptional(data.category),
    city: cleanOptional(data.city),
  }
}
