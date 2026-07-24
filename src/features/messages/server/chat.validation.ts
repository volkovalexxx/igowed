export class ChatValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'ChatValidationError'
  }
}

export type SendMessageInput = {
  text: string
}

export const MAX_MESSAGE_LENGTH = 4000

export function parseSendMessageInput(raw: unknown): SendMessageInput {
  if (!raw || typeof raw !== 'object') {
    throw new ChatValidationError('Некорректные данные сообщения')
  }

  const value = (raw as Record<string, unknown>).text

  if (typeof value !== 'string') {
    throw new ChatValidationError('Некорректный текст сообщения')
  }

  const text = value.trim()

  if (text.length === 0) {
    throw new ChatValidationError('Введите сообщение')
  }

  if (text.length > MAX_MESSAGE_LENGTH) {
    throw new ChatValidationError(`Сообщение не может быть длиннее ${MAX_MESSAGE_LENGTH} символов`)
  }

  return { text }
}
