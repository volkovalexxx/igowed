import { describe, expect, it } from 'vitest'
import { parseCreateEventInput, EventValidationError } from './event.validation'

describe('parseCreateEventInput', () => {
  it('normalizes create event input', () => {
    expect(
      parseCreateEventInput('user-1', {
        eventType: ' Свадьба ',
        title: '  Свадьба   Анны и Максима ',
        eventDate: '2026-07-12',
        eventTime: ' 07:00 ',
        city: ' Москва ',
        guestMin: '20',
        guestMax: '80',
        budgetMin: '10000',
        budgetMax: '150000',
        atmospheres: [' Романтичная ', '', 'Элегантная'],
      })
    ).toMatchObject({
      userId: 'user-1',
      eventType: 'Свадьба',
      title: 'Свадьба Анны и Максима',
      eventTime: '07:00',
      city: 'Москва',
      guestMin: 20,
      guestMax: 80,
      budgetMin: 10000,
      budgetMax: 150000,
      atmospheres: ['Романтичная', 'Элегантная'],
    })
  })

  it('requires a title', () => {
    expect(() => parseCreateEventInput('user-1', { eventType: 'Свадьба' })).toThrow('Название мероприятия обязательно')
  })

  it('rejects invalid ranges', () => {
    expect(() =>
      parseCreateEventInput('user-1', {
        title: 'Свадьба',
        guestMin: 100,
        guestMax: 20,
      })
    ).toThrow(EventValidationError)
  })
})
