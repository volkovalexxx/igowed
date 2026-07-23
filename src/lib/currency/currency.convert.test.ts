import { describe, expect, it } from 'vitest'
import { convertMoney, sumMoney } from './currency.convert'

describe('convertMoney', () => {
  it('не меняет сумму при конвертации в ту же валюту', () => {
    expect(convertMoney({ amount: 5000, currency: 'BYN' }, 'BYN')).toEqual({ amount: 5000, currency: 'BYN' })
  })

  it('конвертирует между валютами через базу', () => {
    const converted = convertMoney({ amount: 100, currency: 'USD' }, 'BYN')

    expect(converted.currency).toBe('BYN')
    expect(converted.amount).toBeGreaterThan(100)
  })

  it('округляет до целых единиц', () => {
    expect(Number.isInteger(convertMoney({ amount: 333, currency: 'RUB' }, 'USD').amount)).toBe(true)
  })

  it('оставляет ноль нулём', () => {
    expect(convertMoney({ amount: 0, currency: 'EUR' }, 'BYN').amount).toBe(0)
  })
})

describe('sumMoney', () => {
  it('складывает суммы в одной валюте без потерь', () => {
    const total = sumMoney(
      [
        { amount: 5000, currency: 'BYN' },
        { amount: 1000, currency: 'BYN' },
      ],
      'BYN',
    )

    expect(total).toEqual({ amount: 6000, currency: 'BYN' })
  })

  it('приводит смешанные валюты к целевой', () => {
    const total = sumMoney(
      [
        { amount: 100, currency: 'BYN' },
        { amount: 100, currency: 'USD' },
      ],
      'BYN',
    )

    expect(total.currency).toBe('BYN')
    expect(total.amount).toBeGreaterThan(200)
  })

  it('отдаёт ноль в целевой валюте для пустого списка', () => {
    expect(sumMoney([], 'USD')).toEqual({ amount: 0, currency: 'USD' })
  })
})
