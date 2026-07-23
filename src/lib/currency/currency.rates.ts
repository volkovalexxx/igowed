import type { CurrencyCode } from './currency.types'

/**
 * Сколько единиц валюты приходится на одну единицу базовой.
 * Таблица статическая: живого источника курсов в проекте пока нет.
 * При появлении провайдера меняется только этот файл, потребители остаются как есть.
 */
export const RATE_BASE: CurrencyCode = 'USD'

export const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  BYN: 3.27,
  RUB: 92.5,
  EUR: 0.92,
}

export const RATES_UPDATED_AT = '2026-07-23'
