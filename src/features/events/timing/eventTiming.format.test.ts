import { describe, expect, it } from 'vitest'
import { compareTimes, formatTimeRange, sortEntries } from './eventTiming.format'
import type { TimelineEntry } from './eventTiming.types'

function entry(overrides: Partial<TimelineEntry> = {}): TimelineEntry {
  return {
    id: 'e1',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Подготовка невесты и жениха',
    location: 'По домам',
    participants: ['Невеста'],
    comment: null,
    order: 0,
    ...overrides,
  }
}

describe('compareTimes', () => {
  it('сравнивает по часам', () => {
    expect(compareTimes('09:00', '11:00')).toBeLessThan(0)
  })

  it('сравнивает по минутам при равных часах', () => {
    expect(compareTimes('12:30', '12:00')).toBeGreaterThan(0)
  })

  it('считает одинаковое время равным', () => {
    expect(compareTimes('14:00', '14:00')).toBe(0)
  })
})

describe('formatTimeRange', () => {
  it('склеивает начало и конец через дефис', () => {
    expect(formatTimeRange('09:00', '11:00')).toBe('09:00-11:00')
  })
})

describe('sortEntries', () => {
  it('сортирует по времени начала', () => {
    const sorted = sortEntries([entry({ id: 'b', startTime: '13:00' }), entry({ id: 'a', startTime: '09:00' })])

    expect(sorted.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('при равном времени сохраняет порядок по order', () => {
    const sorted = sortEntries([
      entry({ id: 'b', startTime: '09:00', order: 2 }),
      entry({ id: 'a', startTime: '09:00', order: 1 }),
    ])

    expect(sorted.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('не мутирует исходный массив', () => {
    const input = [entry({ id: 'b', startTime: '13:00' }), entry({ id: 'a', startTime: '09:00' })]
    sortEntries(input)

    expect(input[0].id).toBe('b')
  })
})
