import { AccountValidationError } from '../account.errors'
import { parseChangePasswordInput } from './accountSecurity.validation'

export type ChangePasswordDeps = {
  findPasswordHash(userId: string): Promise<string | null>
  verifyPassword(plain: string, hash: string): Promise<boolean>
  hashPassword(plain: string): Promise<string>
  updatePassword(userId: string, hash: string): Promise<void>
}

/**
 * Меняет пароль пользователя: проверяет текущий пароль по хэшу, затем сохраняет хэш нового.
 * Аккаунтам без пароля (вход через провайдера) смена недоступна.
 */
export async function changePassword(userId: string, rawInput: unknown, deps: ChangePasswordDeps): Promise<void> {
  if (!userId) {
    throw new AccountValidationError('Требуется авторизация', 401)
  }

  const input = parseChangePasswordInput(rawInput)

  const hash = await deps.findPasswordHash(userId)
  if (!hash) {
    throw new AccountValidationError('У аккаунта нет пароля для смены')
  }

  const ok = await deps.verifyPassword(input.currentPassword, hash)
  if (!ok) {
    throw new AccountValidationError('Неверный текущий пароль', 403)
  }

  const newHash = await deps.hashPassword(input.newPassword)
  await deps.updatePassword(userId, newHash)
}
