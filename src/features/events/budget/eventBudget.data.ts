/** Виртуальная категория «Общий»: не строка в БД, а все статьи мероприятия сразу. */
export const ALL_CATEGORIES_KEY = 'all'

export const ALL_CATEGORIES_TITLE = 'Общий'

export const DEFAULT_BUDGET_CATEGORIES = [
  { title: 'Невеста', order: 0 },
  { title: 'Жених', order: 1 },
  { title: 'Шоу-программа', order: 2 },
  { title: 'Декор', order: 3 },
] as const

export const budgetFieldLabels = {
  title: 'Статья расходов',
  cost: 'Стоимость',
  paid: 'Оплачено',
  due: 'К оплате',
  currency: 'Валюта',
} as const

export const budgetSummaryLabels = {
  total: 'Общий бюджет',
  paid: 'Оплачено',
  due: 'К оплате',
} as const
