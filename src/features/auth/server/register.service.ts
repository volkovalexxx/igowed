import { slugify } from '@/lib/utils'
import { parseRegisterInput, RegisterValidationError } from './register.validation'
import type { RegisterDeps, RegisterUser } from './register.types'

export class RegisterConflictError extends Error {
  status = 409

  constructor(message: string) {
    super(message)
    this.name = 'RegisterConflictError'
  }
}

export async function createRegisterAccount(rawInput: unknown, deps: RegisterDeps): Promise<RegisterUser> {
  const input = parseRegisterInput(rawInput)

  const existing = await deps.findUserByEmail(input.email)
  if (existing) {
    throw new RegisterConflictError('Пользователь с таким email уже существует')
  }

  const user = await deps.createUser({
    email: input.email,
    password: await deps.hashPassword(input.password),
    name: input.name,
    role: input.role,
  })

  if (input.role === 'VENDOR') {
    const nameParts = input.name.split(/\s+/)
    const firstName = nameParts[0] ?? input.name
    const lastName = nameParts.slice(1).join(' ') || firstName
    const baseSlug = slugify(input.name) || `vendor-${user.id.slice(0, 8)}`
    const baseUsername = baseSlug.replace(/-/g, '_') || `user_${user.id.slice(0, 8)}`

    const slug = await buildUniqueValue(baseSlug, deps.findVendorBySlug)
    const username = await buildUniqueValue(baseUsername, deps.findVendorByUsername, '_')

    await deps.createVendor({
      userId: user.id,
      slug,
      firstName,
      lastName,
      username,
      cities: input.city ? [input.city] : [],
      businessType: input.category ?? null,
    })
  }

  return user
}

export function isRegisterError(error: unknown): error is RegisterValidationError | RegisterConflictError {
  return error instanceof RegisterValidationError || error instanceof RegisterConflictError
}

async function buildUniqueValue(
  baseValue: string,
  findExisting: (value: string) => Promise<unknown | null>,
  separator = '-'
) {
  let value = baseValue
  let attempt = 0

  while (await findExisting(value)) {
    attempt += 1
    value = `${baseValue}${separator}${attempt}`
  }

  return value
}
