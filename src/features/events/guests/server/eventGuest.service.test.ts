import { describe, expect, it, vi } from 'vitest'
import { createGuestForEvent, listGuestsForEvent, updateGuestForEvent } from './eventGuest.service'

const guestRecord = {
  id: 'guest-1',
  fullName: 'Олег Белов',
  rsvpStatus: 'confirmed',
  side: 'bride',
  needsTransfer: true,
  needsAccommodation: false,
  comment: null,
  order: 0,
}

describe('event guest service', () => {
  it('returns stored guests without seeding', async () => {
    const deps = {
      listGuests: vi.fn(async () => [guestRecord]),
      seedDefaultGuests: vi.fn(async () => []),
      createGuest: vi.fn(),
      updateGuest: vi.fn(),
      findGuest: vi.fn(),
    }

    await expect(listGuestsForEvent('user-1', 'event-1', deps)).resolves.toEqual([guestRecord])
    expect(deps.seedDefaultGuests).not.toHaveBeenCalled()
  })

  it('seeds defaults for an empty event', async () => {
    const deps = {
      listGuests: vi.fn(async () => []),
      seedDefaultGuests: vi.fn(async () => [guestRecord]),
      createGuest: vi.fn(),
      updateGuest: vi.fn(),
      findGuest: vi.fn(),
    }

    await expect(listGuestsForEvent('user-1', 'event-1', deps)).resolves.toHaveLength(1)
    expect(deps.seedDefaultGuests).toHaveBeenCalledWith('user-1', 'event-1')
  })

  it('creates a guest', async () => {
    const deps = {
      listGuests: vi.fn(),
      seedDefaultGuests: vi.fn(),
      createGuest: vi.fn(async (_userId, _eventId, input) => ({ ...guestRecord, ...input })),
      updateGuest: vi.fn(),
      findGuest: vi.fn(),
    }

    await expect(createGuestForEvent('user-1', 'event-1', { fullName: 'Анна Золотарева' }, deps)).resolves.toMatchObject({
      fullName: 'Анна Золотарева',
      rsvpStatus: 'pending',
    })
  })

  it('updates a guest and returns the refreshed record', async () => {
    const deps = {
      listGuests: vi.fn(),
      seedDefaultGuests: vi.fn(),
      createGuest: vi.fn(),
      updateGuest: vi.fn(async () => ({ count: 1 })),
      findGuest: vi.fn(async () => ({ ...guestRecord, rsvpStatus: 'declined' })),
    }

    await expect(updateGuestForEvent('user-1', 'event-1', 'guest-1', { rsvpStatus: 'declined' }, deps)).resolves.toMatchObject({
      rsvpStatus: 'declined',
    })
  })
})
