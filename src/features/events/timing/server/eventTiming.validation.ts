import { PARTICIPANT_ROLES } from '../eventTiming.data'
import { compareTimes } from '../eventTiming.format'

export class EventTimingValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventTimingValidationError'
  }
}

export type CreateTimelineInput = {
  title: string
}

export type CreateEntryInput = {
  timelineId: string
  startTime: string
  endTime: string
  title: string
  location: string | null
  participants: string[]
  comment: string | null
}

export type UpdateEntryInput = {
  startTime?: string
  endTime?: string
  title?: string
  location?: string | null
  participants?: string[]
  comment?: string | null
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

export function parseTimeInput(value: unknown): string {
  const raw = cleanString(value)
  const match = raw?.match(/^(\d{1,2}):(\d{2})$/)

  if (!match) {
    throw new EventTimingValidationError('Укажите время в формате ЧЧ:ММ')
  }

  const hours = Number(match[1])
  const minutes = Number(match[2])

  if (hours > 23 || minutes > 59) {
    throw new EventTimingValidationError('Укажите время в формате ЧЧ:ММ')
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function parseParticipants(value: unknown): string[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) {
    throw new EventTimingValidationError('Некорректный список участников')
  }

  const roles = new Set<string>()

  for (const item of value) {
    const role = cleanString(item)
    if (!role || !(PARTICIPANT_ROLES as readonly string[]).includes(role)) {
      throw new EventTimingValidationError('Выберите участников из списка')
    }
    roles.add(role)
  }

  return [...roles]
}

function parseOptionalText(value: unknown): string | null {
  return cleanString(value) ?? null
}

export function parseCreateTimelineInput(raw: unknown): CreateTimelineInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTimingValidationError('Некорректные данные тайминга')
  }

  const title = cleanString((raw as Record<string, unknown>).title)
  if (!title) {
    throw new EventTimingValidationError('Название тайминга обязательно')
  }

  return { title }
}

export function parseCreateEntryInput(raw: unknown): CreateEntryInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTimingValidationError('Некорректные данные события')
  }

  const data = raw as Record<string, unknown>
  const timelineId = cleanString(data.timelineId)
  const title = cleanString(data.title)

  if (!timelineId) {
    throw new EventTimingValidationError('Выберите тайминг')
  }

  if (!title) {
    throw new EventTimingValidationError('Название события обязательно')
  }

  const startTime = parseTimeInput(data.startTime)
  const endTime = parseTimeInput(data.endTime)

  if (compareTimes(endTime, startTime) < 0) {
    throw new EventTimingValidationError('Окончание не может быть раньше начала')
  }

  return {
    timelineId,
    startTime,
    endTime,
    title,
    location: parseOptionalText(data.location),
    participants: parseParticipants(data.participants),
    comment: parseOptionalText(data.comment),
  }
}

/**
 * Соотношение времён здесь не проверяется: PATCH может прислать только одну границу,
 * и без сохранённого события вывод невозможен. Инвариант живёт в сервисе.
 */
export function parseUpdateEntryInput(raw: unknown): UpdateEntryInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTimingValidationError('Некорректные данные события')
  }

  const data = raw as Record<string, unknown>
  const input: UpdateEntryInput = {}

  if ('startTime' in data) input.startTime = parseTimeInput(data.startTime)
  if ('endTime' in data) input.endTime = parseTimeInput(data.endTime)

  if ('title' in data) {
    const title = cleanString(data.title)
    if (!title) throw new EventTimingValidationError('Название события обязательно')
    input.title = title
  }

  if ('location' in data) input.location = parseOptionalText(data.location)
  if ('participants' in data) input.participants = parseParticipants(data.participants)
  if ('comment' in data) input.comment = parseOptionalText(data.comment)

  if (Object.keys(input).length === 0) {
    throw new EventTimingValidationError('Нет данных для обновления')
  }

  return input
}
