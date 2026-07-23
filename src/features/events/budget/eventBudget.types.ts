import type { CurrencyCode, Money } from '@/lib/currency/currency.types'

export type BudgetItem = {
  id: string
  title: string
  cost: number
  paid: number
  currency: CurrencyCode
  order: number
}

export type BudgetCategory = {
  id: string
  title: string
  order: number
  items: BudgetItem[]
}

export type BudgetSummaryTotals = {
  total: Money
  paid: Money
  due: Money
}
