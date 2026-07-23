import { isCurrencyCode, type CurrencyCode } from '@/lib/currency/currency.types'

export class EventBudgetValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventBudgetValidationError'
  }
}

export type CreateCategoryInput = {
  title: string
}

export type CreateItemInput = {
  categoryId: string
  title: string
  cost: number
  paid: number
  currency: CurrencyCode
}

export type UpdateItemInput = {
  title?: string
  cost?: number
  paid?: number
  currency?: CurrencyCode
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

function parseAmount(value: unknown, field: string): number {
  if (value === undefined || value === null || value === '') return 0

  const amount = typeof value === 'string' ? Number(value.replace(/\s/g, '')) : value
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 0) {
    throw new EventBudgetValidationError(`Поле «${field}» должно быть целым неотрицательным числом`)
  }

  return amount
}

function parseCurrency(value: unknown): CurrencyCode {
  if (value === undefined || value === null || value === '') return 'BYN'
  if (!isCurrencyCode(value)) {
    throw new EventBudgetValidationError('Выберите валюту из списка')
  }

  return value
}

export function parseCreateCategoryInput(raw: unknown): CreateCategoryInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventBudgetValidationError('Некорректные данные категории')
  }

  const title = cleanString((raw as Record<string, unknown>).title)
  if (!title) {
    throw new EventBudgetValidationError('Название категории обязательно')
  }

  return { title }
}

export function parseCreateItemInput(raw: unknown): CreateItemInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventBudgetValidationError('Некорректные данные статьи расходов')
  }

  const data = raw as Record<string, unknown>
  const categoryId = cleanString(data.categoryId)
  const title = cleanString(data.title)

  if (!categoryId) {
    throw new EventBudgetValidationError('Выберите категорию расходов')
  }

  if (!title) {
    throw new EventBudgetValidationError('Название статьи обязательно')
  }

  const cost = parseAmount(data.cost, 'Стоимость')
  const paid = parseAmount(data.paid, 'Оплачено')

  if (paid > cost) {
    throw new EventBudgetValidationError('Оплачено не может превышать стоимость')
  }

  return { categoryId, title, cost, paid, currency: parseCurrency(data.currency) }
}

/**
 * Соотношение `paid <= cost` здесь не проверяется: PATCH может прислать одно поле,
 * и без сохранённой статьи вывод невозможен. Инвариант живёт в сервисе.
 */
export function parseUpdateItemInput(raw: unknown): UpdateItemInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventBudgetValidationError('Некорректные данные статьи расходов')
  }

  const data = raw as Record<string, unknown>
  const input: UpdateItemInput = {}

  if ('title' in data) {
    const title = cleanString(data.title)
    if (!title) throw new EventBudgetValidationError('Название статьи обязательно')
    input.title = title
  }

  if ('cost' in data) input.cost = parseAmount(data.cost, 'Стоимость')
  if ('paid' in data) input.paid = parseAmount(data.paid, 'Оплачено')
  if ('currency' in data) input.currency = parseCurrency(data.currency)

  if (Object.keys(input).length === 0) {
    throw new EventBudgetValidationError('Нет данных для обновления')
  }

  return input
}
