import { describe, expect, it } from 'vitest'
import { formatEventDate, formatEventDateCompact, formatEventPlace, formatEventPlaceShort, formatEventRange } from './eventList.format'

describe('event list formatters', () => {
  it('formats empty date and place states', () => {
    expect(formatEventDate(null)).toBe('Дата не выбрана')
    expect(formatEventPlace(null, null)).toBe('Место не выбрано')
  })

  it('formats display dates', () => {
    const date = new Date('2026-07-12T00:00:00.000Z')

    expect(formatEventDate(date)).toContain('2026')
    expect(formatEventDateCompact(date)).toBe('12.07.2026')
  })

  it('formats place from country and city', () => {
    expect(formatEventPlace('Беларусь', 'Минск')).toBe('Беларусь, Минск')
    expect(formatEventPlaceShort('Минск')).toBe('Минск')
    expect(formatEventPlaceShort(null)).toBe('Москва')
  })

  it('formats ranges', () => {
    expect(formatEventRange(20, 80, 'чел.')).toBe('20 - 80 чел.')
    expect(formatEventRange(10000, null, '₽')).toBe('от 10000 ₽')
    expect(formatEventRange(null, 150000, '₽')).toBe('до 150000 ₽')
    expect(formatEventRange(null, null, '₽')).toBe('Не указано')
  })
})
