import { isCurrencyCode } from '@/lib/currency/currency.types'
import type { BudgetCategory, BudgetItem } from '../eventBudget.types'

type BudgetItemRecord = {
  id: string
  title: string
  cost: number
  paid: number
  currency: string
  order: number
}

type BudgetCategoryRecord = {
  id: string
  title: string
  order: number
  items: BudgetItemRecord[]
}

export function mapBudgetItemRecord(item: BudgetItemRecord): BudgetItem {
  return {
    id: item.id,
    title: item.title,
    cost: item.cost,
    paid: item.paid,
    currency: isCurrencyCode(item.currency) ? item.currency : 'BYN',
    order: item.order,
  }
}

export function mapBudgetCategoryRecord(category: BudgetCategoryRecord): BudgetCategory {
  return {
    id: category.id,
    title: category.title,
    order: category.order,
    items: category.items.map(mapBudgetItemRecord),
  }
}
