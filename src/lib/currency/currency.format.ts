import type { Money } from './currency.types'

const NON_BREAKING_SPACE = ' '

const amountFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

/**
 * `Intl` разделяет разряды то узким, то обычным неразрывным пробелом в зависимости от версии ICU.
 * Приводим к одному символу, чтобы вёрстка и тесты не зависели от среды.
 */
export function formatAmount(amount: number): string {
  return amountFormatter.format(amount).replace(/\s/g, NON_BREAKING_SPACE)
}

export function formatMoney(money: Money): string {
  return `${formatAmount(money.amount)} ${money.currency}`
}
