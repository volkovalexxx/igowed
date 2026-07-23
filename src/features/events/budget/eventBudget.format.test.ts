import { describe, expect, it } from 'vitest'
import { ALL_CATEGORIES_KEY } from './eventBudget.data'
import { getItemDue, selectCategoryItems, summarizeBudget } from './eventBudget.format'
import type { BudgetCategory, BudgetItem } from './eventBudget.types'

function item(overrides: Partial<BudgetItem> = {}): BudgetItem {
  return { id: 'i1', title: 'Кольца', cost: 5000, paid: 1000, currency: 'BYN', order: 0, ...overrides }
}

const categories: BudgetCategory[] = [
  { id: 'c1', title: 'Невеста', order: 0, items: [item({ id: 'i1' })] },
  { id: 'c2', title: 'Жених', order: 1, items: [item({ id: 'i2', cost: 3000, paid: 3000 })] },
]

describe('getItemDue', () => {
  it('вычитает оплаченное из стоимости', () => {
    expect(getItemDue(item({ cost: 5000, paid: 1000 }))).toBe(4000)
  })

  it('отдаёт ноль для полностью оплаченной статьи', () => {
    expect(getItemDue(item({ cost: 3000, paid: 3000 }))).toBe(0)
  })
})

describe('selectCategoryItems', () => {
  it('собирает все статьи для виртуальной категории «общий»', () => {
    expect(selectCategoryItems(categories, ALL_CATEGORIES_KEY).map((entry) => entry.id)).toEqual(['i1', 'i2'])
  })

  it('отдаёт статьи одной категории', () => {
    expect(selectCategoryItems(categories, 'c2').map((entry) => entry.id)).toEqual(['i2'])
  })

  it('отдаёт пустой список для неизвестной категории', () => {
    expect(selectCategoryItems(categories, 'нет-такой')).toEqual([])
  })
})

describe('summarizeBudget', () => {
  it('считает общий бюджет, оплаченное и остаток', () => {
    const totals = summarizeBudget([item({ cost: 5000, paid: 1000 }), item({ id: 'i2', cost: 3000, paid: 500 })], 'BYN')

    expect(totals.total).toEqual({ amount: 8000, currency: 'BYN' })
    expect(totals.paid).toEqual({ amount: 1500, currency: 'BYN' })
    expect(totals.due).toEqual({ amount: 6500, currency: 'BYN' })
  })

  it('приводит статьи в разных валютах к валюте сводки', () => {
    const totals = summarizeBudget(
      [item({ cost: 100, paid: 0, currency: 'BYN' }), item({ id: 'i2', cost: 100, paid: 0, currency: 'USD' })],
      'BYN',
    )

    expect(totals.total.currency).toBe('BYN')
    expect(totals.total.amount).toBeGreaterThan(200)
  })

  it('отдаёт нули для пустого бюджета', () => {
    const totals = summarizeBudget([], 'BYN')

    expect(totals.total.amount).toBe(0)
    expect(totals.paid.amount).toBe(0)
    expect(totals.due.amount).toBe(0)
  })
})
