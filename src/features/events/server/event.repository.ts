import prisma from '@/lib/prisma'
import type { CreateEventInput } from './event.types'

export const eventRepository = {
  createEvent(input: CreateEventInput) {
    return prisma.event.create({
      data: input,
    })
  },

  findEventById(userId: string, eventId: string) {
    return prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
      },
    })
  },

  listEvents(userId: string) {
    return prisma.event.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          eventDate: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    })
  },
}
