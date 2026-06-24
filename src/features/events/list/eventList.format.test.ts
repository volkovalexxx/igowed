import { describe, expect, it } from 'vitest'
import { formatEventDate, formatEventPlace, formatEventRange } from './eventList.format'

describe('event list formatters', () => {
  it('formats empty date and place states', () => {
    expect(formatEventDate(null)).toBe('Дата не выбрана')
    expect(formatEventPlace(null, null)).toBe('Место не выбрано')
  })

  it('formats place from country and city', () => {
    expect(formatEventPlace('Беларусь', 'Минск')).toBe('Беларусь, Минск')
  })

  it('formats ranges', () => {
    expect(formatEventRange(20, 80, 'чел.')).toBe('20 - 80 чел.')
    expect(formatEventRange(10000, null, '₽')).toBe('от 10000 ₽')
    expect(formatEventRange(null, 150000, '₽')).toBe('до 150000 ₽')
    expect(formatEventRange(null, null, '₽')).toBe('Не указано')
  })
})
