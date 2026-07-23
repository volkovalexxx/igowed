export const CURRENCY_CODES = ['BYN', 'RUB', 'USD', 'EUR'] as const

export type CurrencyCode = (typeof CURRENCY_CODES)[number]

export type Money = {
  amount: number
  currency: CurrencyCode
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && (CURRENCY_CODES as readonly string[]).includes(value)
}
