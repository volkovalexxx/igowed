import { describe, expect, it } from 'vitest'
import { getEventPhase, isEventFinished } from './eventPhase'

const now = new Date('2026-07-23T12:00:00Z')

describe('getEventPhase', () => {
  it('считает будущее мероприятие предстоящим', () => {
    expect(getEventPhase(new Date('2026-08-01T00:00:00Z'), now)).toBe('upcoming')
  })

  it('считает прошедшее мероприятие завершённым', () => {
    expect(getEventPhase(new Date('2026-07-01T00:00:00Z'), now)).toBe('past')
  })

  it('в день мероприятия оно ещё предстоящее', () => {
    expect(getEventPhase(new Date('2026-07-23T20:00:00Z'), now)).toBe('upcoming')
  })

  it('мероприятие завершено только со следующего дня', () => {
    expect(getEventPhase(new Date('2026-07-22T23:59:00Z'), now)).toBe('past')
  })

  it('без даты мероприятие считается предстоящим', () => {
    expect(getEventPhase(null, now)).toBe('upcoming')
  })
})

describe('isEventFinished', () => {
  it('отдаёт true для прошедшего', () => {
    expect(isEventFinished(new Date('2026-01-01T00:00:00Z'), now)).toBe(true)
  })

  it('отдаёт false для предстоящего', () => {
    expect(isEventFinished(new Date('2027-01-01T00:00:00Z'), now)).toBe(false)
  })
})
