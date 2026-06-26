import { describe, expect, it } from 'vitest'
import { filterGuestsByStatus, getRsvpLabel, getSideLabel } from './eventGuests.format'
import type { EventGuest } from './eventGuests.types'

const guests: EventGuest[] = [
  {
    id: 'guest-1',
    fullName: 'Олег Белов',
    rsvpStatus: 'confirmed',
    side: 'bride',
    needsTransfer: true,
    needsAccommodation: false,
    comment: null,
    order: 0,
  },
  {
    id: 'guest-2',
    fullName: 'Николай Петров',
    rsvpStatus: 'pending',
    side: 'groom',
    needsTransfer: false,
    needsAccommodation: false,
    comment: null,
    order: 1,
  },
]

describe('event guest helpers', () => {
  it('formats guest labels', () => {
    expect(getRsvpLabel('confirmed')).toBe('Да')
    expect(getRsvpLabel('pending')).toBe('Не подтвержден')
    expect(getSideLabel('groom')).toBe('Гость жениха')
  })

  it('filters guests by rsvp status', () => {
    expect(filterGuestsByStatus(guests, 'all')).toHaveLength(2)
    expect(filterGuestsByStatus(guests, 'confirmed')).toEqual([guests[0]])
  })
})
