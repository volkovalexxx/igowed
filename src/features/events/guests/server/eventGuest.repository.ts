import prisma from '@/lib/prisma'
import { defaultGuests } from '../eventGuests.data'
import type { CreateGuestInput, UpdateGuestInput } from './eventGuest.validation'

export const eventGuestRepository = {
  listGuests(userId: string, eventId: string) {
    return prisma.eventGuest.findMany({
      where: {
        eventId,
        event: {
          userId,
        },
      },
      orderBy: {
        order: 'asc',
      },
    })
  },

  async seedDefaultGuests(userId: string, eventId: string) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
      },
      select: {
        id: true,
      },
    })

    if (!event) return []

    await prisma.$transaction(
      defaultGuests.map((guest) =>
        prisma.eventGuest.create({
          data: {
            eventId,
            fullName: guest.fullName,
            rsvpStatus: guest.rsvpStatus,
            side: guest.side,
            needsTransfer: guest.needsTransfer,
            needsAccommodation: guest.needsAccommodation,
            comment: guest.comment,
            order: guest.order,
          },
        }),
      ),
    )

    return this.listGuests(userId, eventId)
  },

  async createGuest(userId: string, eventId: string, input: CreateGuestInput) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
      },
      select: {
        id: true,
        _count: {
          select: {
            guests: true,
          },
        },
      },
    })

    if (!event) return null

    return prisma.eventGuest.create({
      data: {
        eventId,
        ...input,
        order: event._count.guests,
      },
    })
  },

  updateGuest(userId: string, eventId: string, guestId: string, input: UpdateGuestInput) {
    return prisma.eventGuest.updateMany({
      where: {
        id: guestId,
        eventId,
        event: {
          userId,
        },
      },
      data: input,
    })
  },

  findGuest(userId: string, eventId: string, guestId: string) {
    return prisma.eventGuest.findFirst({
      where: {
        id: guestId,
        eventId,
        event: {
          userId,
        },
      },
    })
  },
}
