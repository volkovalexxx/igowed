import type { CreateEventInput } from './event.types'

export class EventValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventValidationError'
  }
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

function cleanNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return undefined
  const numeric = Number(value)
  if (!Number.isInteger(numeric) || numeric < 0) {
    throw new EventValidationError('Числовые поля должны быть положительными целыми числами')
  }
  return numeric
}

function cleanDate(value: unknown) {
  const raw = cleanString(value)
  if (!raw) return undefined
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) {
    throw new EventValidationError('Введите корректную дату мероприятия')
  }
  return date
}

function cleanList(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.map(cleanString).filter((item): item is string => Boolean(item))
}

export function parseCreateEventInput(userId: string, raw: unknown): CreateEventInput {
  if (!userId) {
    throw new EventValidationError('Требуется авторизация')
  }

  if (!raw || typeof raw !== 'object') {
    throw new EventValidationError('Некорректные данные мероприятия')
  }

  const data = raw as Record<string, unknown>
  const eventType = cleanString(data.eventType) ?? 'Свадьба'
  const title = cleanString(data.title)

  if (!title) {
    throw new EventValidationError('Название мероприятия обязательно')
  }

  const guestMin = cleanNumber(data.guestMin)
  const guestMax = cleanNumber(data.guestMax)
  const budgetMin = cleanNumber(data.budgetMin)
  const budgetMax = cleanNumber(data.budgetMax)

  if (guestMin !== undefined && guestMax !== undefined && guestMin > guestMax) {
    throw new EventValidationError('Минимальное количество гостей не может быть больше максимального')
  }

  if (budgetMin !== undefined && budgetMax !== undefined && budgetMin > budgetMax) {
    throw new EventValidationError('Минимальный бюджет не может быть больше максимального')
  }

  return {
    userId,
    eventType,
    title,
    eventDate: cleanDate(data.eventDate),
    eventTime: cleanString(data.eventTime),
    country: cleanString(data.country),
    city: cleanString(data.city),
    brideName: cleanString(data.brideName),
    groomName: cleanString(data.groomName),
    guestMin,
    guestMax,
    budgetMin,
    budgetMax,
    format: cleanString(data.format),
    atmospheres: cleanList(data.atmospheres),
    notes: cleanString(data.notes),
    coverUrl: cleanString(data.coverUrl),
  }
}
