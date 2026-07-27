import { AccountValidationError } from '../account.errors'
import { parseDeleteAccountInput } from './accountDelete.validation'

export type DeleteAccountDeps = {
  deleteUser(userId: string): Promise<{ count: number }>
}

/**
 * Необратимо удаляет аккаунт текущего пользователя после слова-подтверждения. Связанные записи
 * (профиль подрядчика, события, заявки, отзывы) удаляются каскадом на уровне БД.
 */
export async function deleteAccount(userId: string, rawInput: unknown, deps: DeleteAccountDeps): Promise<void> {
  if (!userId) {
    throw new AccountValidationError('Требуется авторизация', 401)
  }

  parseDeleteAccountInput(rawInput)

  const result = await deps.deleteUser(userId)
  if (result.count < 1) {
    throw new AccountValidationError('Аккаунт не найден', 404)
  }
}
