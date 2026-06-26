import { describe, expect, it } from 'vitest'
import { EventGuestValidationError, parseCreateGuestInput, parseUpdateGuestInput } from './eventGuest.validation'

describe('event guest validation', () => {
  it('normalizes a create guest payload', () => {
    expect(
      parseCreateGuestInput({
        fullName: '  Олег   Белов ',
        rsvpStatus: 'confirmed',
        side: 'groom',
        needsTransfer: true,
        needsAccommodation: false,
        comment: '  Вегетарианское меню ',
      }),
    ).toEqual({
      fullName: 'Олег Белов',
      rsvpStatus: 'confirmed',
      side: 'groom',
      needsTransfer: true,
      needsAccommodation: false,
      comment: 'Вегетарианское меню',
    })
  })

  it('requires guest name', () => {
    expect(() => parseCreateGuestInput({ fullName: '' })).toThrow(EventGuestValidationError)
  })

  it('requires update fields', () => {
    expect(() => parseUpdateGuestInput({})).toThrow(EventGuestValidationError)
  })
})
