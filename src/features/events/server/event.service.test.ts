import { describe, expect, it, vi } from 'vitest'
import { createEventForUser, getEventForUser, listEventsForUser } from './event.service'
import type { EventDeps, EventRecord } from './event.types'

const eventFixture: EventRecord = {
  id: 'event-1',
  userId: 'user-1',
  eventType: 'Свадьба',
  title: 'Свадьба',
  eventDate: null,
  eventTime: null,
  country: null,
  city: null,
  brideName: null,
  groomName: null,
  guestMin: null,
  guestMax: null,
  budgetMin: null,
  budgetMax: null,
  format: null,
  atmospheres: [],
  notes: null,
  coverUrl: null,
  createdAt: new Date('2026-06-24T00:00:00.000Z'),
  updatedAt: new Date('2026-06-24T00:00:00.000Z'),
}

describe('event service', () => {
  it('persists a normalized event for the signed-in user', async () => {
    const deps: EventDeps = {
      createEvent: vi.fn(async (input) => ({
        ...eventFixture,
        userId: input.userId,
        eventType: input.eventType,
        title: input.title,
        format: input.format ?? null,
      })),
    }

    const event = await createEventForUser(
      'user-1',
      {
        title: 'Свадьба',
        format: 'Официальное',
      },
      deps,
    )

    expect(event.id).toBe('event-1')
    expect(deps.createEvent).toHaveBeenCalledWith({
      userId: 'user-1',
      eventType: 'Свадьба',
      title: 'Свадьба',
      eventDate: undefined,
      eventTime: undefined,
      country: undefined,
      city: undefined,
      brideName: undefined,
      groomName: undefined,
      guestMin: undefined,
      guestMax: undefined,
      budgetMin: undefined,
      budgetMax: undefined,
      format: 'Официальное',
      atmospheres: [],
      notes: undefined,
      coverUrl: undefined,
    })
  })

  it('returns a user event by id', async () => {
    const deps: EventDeps = {
      createEvent: vi.fn(),
      findEventById: vi.fn(async () => eventFixture),
    }

    await expect(getEventForUser('user-1', 'event-1', deps)).resolves.toEqual(eventFixture)
    expect(deps.findEventById).toHaveBeenCalledWith('user-1', 'event-1')
  })

  it('lists events for the signed-in user', async () => {
    const deps: EventDeps = {
      createEvent: vi.fn(),
      listEvents: vi.fn(async () => [eventFixture]),
    }

    await expect(listEventsForUser('user-1', deps)).resolves.toEqual([eventFixture])
    expect(deps.listEvents).toHaveBeenCalledWith('user-1')
  })
})
