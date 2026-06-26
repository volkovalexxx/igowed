import type { TaskPriority, TaskStatus } from '../eventTasks.types'

export class EventTaskValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventTaskValidationError'
  }
}

export type CreateTaskListInput = {
  title: string
}

export type CreateTaskInput = {
  listId: string
  title: string
  priority: TaskPriority
  deadline: Date | null
}

export type UpdateTaskInput = {
  title?: string
  priority?: TaskPriority
  deadline?: Date | null
  status?: TaskStatus
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

function parsePriority(value: unknown): TaskPriority {
  if (value === 'high' || value === 'medium' || value === 'low') return value
  return 'medium'
}

function parseStatus(value: unknown): TaskStatus {
  if (value === 'done' || value === 'open') return value
  throw new EventTaskValidationError('Укажите корректный статус задачи')
}

export function parseDeadline(value: unknown): Date | null {
  const raw = cleanString(value)
  if (!raw) return null

  const ruDate = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (ruDate) {
    const [, day, month, year] = ruDate
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
    if (date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day)) {
      return date
    }
  }

  const isoDate = new Date(raw)
  if (!Number.isNaN(isoDate.getTime())) return isoDate

  throw new EventTaskValidationError('Укажите дедлайн в формате ДД.ММ.ГГГГ')
}

export function parseCreateTaskListInput(raw: unknown): CreateTaskListInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTaskValidationError('Некорректные данные списка задач')
  }

  const title = cleanString((raw as Record<string, unknown>).title)
  if (!title) {
    throw new EventTaskValidationError('Название списка обязательно')
  }

  return { title }
}

export function parseCreateTaskInput(raw: unknown): CreateTaskInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTaskValidationError('Некорректные данные задачи')
  }

  const data = raw as Record<string, unknown>
  const listId = cleanString(data.listId)
  const title = cleanString(data.title)

  if (!listId) {
    throw new EventTaskValidationError('Выберите список для задачи')
  }

  if (!title) {
    throw new EventTaskValidationError('Название задачи обязательно')
  }

  return {
    listId,
    title,
    priority: parsePriority(data.priority),
    deadline: parseDeadline(data.deadline),
  }
}

export function parseUpdateTaskInput(raw: unknown): UpdateTaskInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTaskValidationError('Некорректные данные задачи')
  }

  const data = raw as Record<string, unknown>
  const input: UpdateTaskInput = {}

  if ('title' in data) {
    const title = cleanString(data.title)
    if (!title) throw new EventTaskValidationError('Название задачи обязательно')
    input.title = title
  }

  if ('priority' in data) {
    input.priority = parsePriority(data.priority)
  }

  if ('deadline' in data) {
    input.deadline = parseDeadline(data.deadline)
  }

  if ('status' in data) {
    input.status = parseStatus(data.status)
  }

  if (Object.keys(input).length === 0) {
    throw new EventTaskValidationError('Нет данных для обновления')
  }

  return input
}
