import { AccountValidationError } from '../account.errors'

export const DELETE_CONFIRM_WORD = 'УДАЛИТЬ'

/** Требует точного слова-подтверждения перед необратимым удалением аккаунта. */
export function parseDeleteAccountInput(raw: unknown): void {
  if (!raw || typeof raw !== 'object') {
    throw new AccountValidationError('Некорректные данные')
  }

  const confirm = (raw as Record<string, unknown>).confirm
  if (typeof confirm !== 'string' || confirm.trim() !== DELETE_CONFIRM_WORD) {
    throw new AccountValidationError(`Введите «${DELETE_CONFIRM_WORD}» для подтверждения`)
  }
}
