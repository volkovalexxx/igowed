import { describe, expect, it } from 'vitest'
import { formatAmount, formatMoney } from './currency.format'

describe('formatAmount', () => {
  it('разделяет разряды неразрывным пробелом', () => {
    expect(formatAmount(15000)).toBe('15 000')
  })

  it('не трогает числа меньше тысячи', () => {
    expect(formatAmount(500)).toBe('500')
  })

  it('форматирует ноль', () => {
    expect(formatAmount(0)).toBe('0')
  })
})

describe('formatMoney', () => {
  it('ставит код валюты после суммы', () => {
    expect(formatMoney({ amount: 15000, currency: 'BYN' })).toBe('15 000 BYN')
  })
})
