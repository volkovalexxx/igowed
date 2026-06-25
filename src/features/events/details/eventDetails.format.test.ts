import { describe, expect, it } from 'vitest'
import { formatEventDateNumeric, formatEventDateShort, formatEventNumber, formatEventPlace, getDaysUntilEvent } from './eventDetails.format'

describe('event details formatters', () => {
  it('formats event date variants', () => {
    const date = new Date('2026-07-12T00:00:00.000Z')

    expect(formatEventDateShort(date)).toBe('12 июля 2026 г.')
    expect(formatEventDateNumeric(date)).toBe('12.07.26')
  })

  it('formats location and numbers', () => {
    expect(formatEventPlace('Россия', 'Москва')).toBe('Москва Россия')
    expect(formatEventPlace(null, null)).toBe('Место не выбрано')
    expect(formatEventNumber(15000)).toBe('15 000')
  })

  it('calculates days until event', () => {
    expect(getDaysUntilEvent(new Date('2026-07-12T00:00:00.000Z'), new Date('2026-07-01T00:00:00.000Z'))).toBe(11)
    expect(getDaysUntilEvent(new Date('2026-06-12T00:00:00.000Z'), new Date('2026-07-01T00:00:00.000Z'))).toBe(0)
  })
})
