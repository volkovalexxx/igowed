import { describe, expect, it } from 'vitest'
import { formatProfilePrice, formatReviewDate, formatServicePrice } from './vendorProfile.format'

describe('formatProfilePrice', () => {
  it('строит «от X руб/час» из почасовой ставки', () => {
    expect(formatProfilePrice(5000, 'RUB')).toMatch(/^от 5\s000 руб \/ час$/)
  })

  it('маппит BYN как есть', () => {
    expect(formatProfilePrice(300, 'BYN')).toMatch(/BYN \/ час$/)
  })

  it('без ставки отдаёт «Цена по запросу»', () => {
    expect(formatProfilePrice(null, 'RUB')).toBe('Цена по запросу')
  })
})

describe('formatServicePrice', () => {
  it('склеивает сумму, валюту и единицу', () => {
    expect(formatServicePrice(5000, 'RUB', 'час')).toMatch(/^5\s000 руб \/ час$/)
  })

  it('без единицы — только сумма и валюта', () => {
    expect(formatServicePrice(80000, 'RUB', null)).toMatch(/^80\s000 руб$/)
  })

  it('без цены — «Цена по запросу»', () => {
    expect(formatServicePrice(null, 'RUB', 'час')).toBe('Цена по запросу')
  })
})

describe('formatReviewDate', () => {
  it('форматирует дату по-русски', () => {
    expect(formatReviewDate(new Date('2025-03-15T00:00:00Z'))).toBe('15 марта 2025')
  })

  it('форматирует однозначный день без ведущего нуля', () => {
    expect(formatReviewDate(new Date('2025-02-02T00:00:00Z'))).toBe('2 февраля 2025')
  })
})
