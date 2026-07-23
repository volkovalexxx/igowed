import { RATES } from './currency.rates'
import type { CurrencyCode, Money } from './currency.types'

export function convertMoney(money: Money, to: CurrencyCode): Money {
  if (money.currency === to) {
    return { amount: money.amount, currency: to }
  }

  const inBase = money.amount / RATES[money.currency]
  return { amount: Math.round(inBase * RATES[to]), currency: to }
}

export function sumMoney(list: readonly Money[], to: CurrencyCode): Money {
  const amount = list.reduce((total, money) => total + convertMoney(money, to).amount, 0)
  return { amount, currency: to }
}
