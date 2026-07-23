import { isCurrencyCode, type CurrencyCode } from '@/lib/currency/currency.types'
import { mapBudgetCategoryRecord, mapBudgetItemRecord } from './eventBudget.mapper'
import {
  EventBudgetValidationError,
  parseCreateCategoryInput,
  parseCreateItemInput,
  parseUpdateItemInput,
} from './eventBudget.validation'

export const FALLBACK_SUMMARY_CURRENCY: CurrencyCode = 'BYN'

type EventBudgetDeps = {
  findSummaryCurrency(userId: string, eventId: string): Promise<string | null>
  listCategories(userId: string, eventId: string): Promise<Parameters<typeof mapBudgetCategoryRecord>[0][]>
  seedDefaultCategories(userId: string, eventId: string): Promise<Parameters<typeof mapBudgetCategoryRecord>[0][]>
  createCategory(userId: string, eventId: string, title: string): Promise<Parameters<typeof mapBudgetCategoryRecord>[0] | null>
  createItem(
    userId: string,
    eventId: string,
    input: ReturnType<typeof parseCreateItemInput>,
  ): Promise<Parameters<typeof mapBudgetItemRecord>[0] | null>
  updateItem(
    userId: string,
    eventId: string,
    itemId: string,
    input: ReturnType<typeof parseUpdateItemInput>,
  ): Promise<{ count: number }>
  findItem(userId: string, eventId: string, itemId: string): Promise<Parameters<typeof mapBudgetItemRecord>[0] | null>
}

function ensureAccess<T>(record: T | null) {
  if (!record) {
    throw new EventBudgetValidationError('Мероприятие или статья расходов не найдены')
  }
  return record
}

export async function listBudgetCategoriesForEvent(userId: string, eventId: string, deps: EventBudgetDeps) {
  if (!userId || !eventId) return []

  const categories = await deps.listCategories(userId, eventId)
  if (categories.length > 0) return categories.map(mapBudgetCategoryRecord)

  const seeded = await deps.seedDefaultCategories(userId, eventId)
  return seeded.map(mapBudgetCategoryRecord)
}

/** Валюта сводки живёт на мероприятии; неизвестное значение из БД не должно ломать экран. */
export async function getBudgetSummaryCurrency(userId: string, eventId: string, deps: EventBudgetDeps): Promise<CurrencyCode> {
  if (!userId || !eventId) return FALLBACK_SUMMARY_CURRENCY

  const stored = await deps.findSummaryCurrency(userId, eventId)
  return isCurrencyCode(stored) ? stored : FALLBACK_SUMMARY_CURRENCY
}

export async function createBudgetCategoryForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventBudgetDeps) {
  const input = parseCreateCategoryInput(rawInput)
  const category = await deps.createCategory(userId, eventId, input.title)
  return mapBudgetCategoryRecord(ensureAccess(category))
}

export async function createBudgetItemForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventBudgetDeps) {
  const input = parseCreateItemInput(rawInput)
  const item = await deps.createItem(userId, eventId, input)
  return mapBudgetItemRecord(ensureAccess(item))
}

/**
 * Инвариант `paid <= cost` проверяется по слитому состоянию «статья из БД + патч»:
 * PATCH может прислать только одно из двух полей.
 */
export async function updateBudgetItemForEvent(
  userId: string,
  eventId: string,
  itemId: string,
  rawInput: unknown,
  deps: EventBudgetDeps,
) {
  const input = parseUpdateItemInput(rawInput)
  const current = ensureAccess(await deps.findItem(userId, eventId, itemId))

  const cost = input.cost ?? current.cost
  const paid = input.paid ?? current.paid

  if (paid > cost) {
    throw new EventBudgetValidationError('Оплачено не может превышать стоимость')
  }

  const result = await deps.updateItem(userId, eventId, itemId, input)
  if (result.count < 1) ensureAccess(null)

  return mapBudgetItemRecord(ensureAccess(await deps.findItem(userId, eventId, itemId)))
}

export function isEventBudgetError(error: unknown): error is EventBudgetValidationError {
  return error instanceof EventBudgetValidationError
}
