import { AccountValidationError } from '../account.errors'

export const MIN_PASSWORD_LENGTH = 8

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}

/**
 * Разбирает тело смены пароля: текущий, новый и подтверждение обязательны; новый — не короче
 * 8 символов, совпадает с подтверждением и отличается от текущего.
 */
export function parseChangePasswordInput(raw: unknown): ChangePasswordInput {
  if (!raw || typeof raw !== 'object') {
    throw new AccountValidationError('Некорректные данные')
  }

  const source = raw as Record<string, unknown>
  const currentPassword = source.currentPassword
  const newPassword = source.newPassword
  const confirmPassword = source.confirmPassword

  if (typeof currentPassword !== 'string' || currentPassword.length === 0) {
    throw new AccountValidationError('Введите текущий пароль')
  }

  if (typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
    throw new AccountValidationError('Заполните все поля')
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    throw new AccountValidationError(`Новый пароль должен быть не менее ${MIN_PASSWORD_LENGTH} символов`)
  }

  if (newPassword !== confirmPassword) {
    throw new AccountValidationError('Пароли не совпадают')
  }

  if (newPassword === currentPassword) {
    throw new AccountValidationError('Новый пароль совпадает с текущим')
  }

  return { currentPassword, newPassword }
}
