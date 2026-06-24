import { describe, expect, it, vi } from 'vitest'
import { createEventForUser } from './event.service'
import type { EventDeps } from './event.types'

describe('createEventForUser', () => {
  it('persists a normalized event for the signed-in user', async () => {
    const deps: EventDeps = {
      createEvent: vi.fn(async (input) => ({
        id: 'event-1',
        userId: input.userId,
        eventType: input.eventType,
        title: input.title,
        eventDate: input.eventDate ?? null,
        eventTime: input.eventTime ?? null,
        country: input.country ?? null,
        city: input.city ?? null,
        brideName: input.brideName ?? null,
        groomName: input.groomName ?? null,
        guestMin: input.guestMin ?? null,
        guestMax: input.guestMax ?? null,
        budgetMin: input.budgetMin ?? null,
        budgetMax: input.budgetMax ?? null,
        format: input.format ?? null,
        atmospheres: input.atmospheres,
        notes: input.notes ?? null,
        coverUrl: input.coverUrl ?? null,
        createdAt: new Date('2026-06-24T00:00:00.000Z'),
        updatedAt: new Date('2026-06-24T00:00:00.000Z'),
      })),
    }

    const event = await createEventForUser(
      'user-1',
      {
        title: 'Свадьба',
        format: 'Официальное',
      },
      deps
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
})
