import { sumMoney } from '@/lib/currency/currency.convert'
import type { CurrencyCode } from '@/lib/currency/currency.types'
import { ALL_CATEGORIES_KEY } from './eventBudget.data'
import type { BudgetCategory, BudgetItem, BudgetSummaryTotals } from './eventBudget.types'

/** «К оплате» не хранится: иначе можно сохранить взаимно противоречивые числа. */
export function getItemDue(item: BudgetItem): number {
  return item.cost - item.paid
}

export function selectCategoryItems(categories: readonly BudgetCategory[], categoryId: string): BudgetItem[] {
  if (categoryId === ALL_CATEGORIES_KEY) {
    return categories.flatMap((category) => category.items)
  }

  return categories.find((category) => category.id === categoryId)?.items ?? []
}

export function summarizeBudget(items: readonly BudgetItem[], currency: CurrencyCode): BudgetSummaryTotals {
  return {
    total: sumMoney(
      items.map((item) => ({ amount: item.cost, currency: item.currency })),
      currency,
    ),
    paid: sumMoney(
      items.map((item) => ({ amount: item.paid, currency: item.currency })),
      currency,
    ),
    due: sumMoney(
      items.map((item) => ({ amount: getItemDue(item), currency: item.currency })),
      currency,
    ),
  }
}
