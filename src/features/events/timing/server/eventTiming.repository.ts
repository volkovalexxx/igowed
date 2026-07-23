import prisma from '@/lib/prisma'
import { DEFAULT_TIMELINE_TITLE } from '../eventTiming.data'
import type { CreateEntryInput, UpdateEntryInput } from './eventTiming.validation'

const timelineInclude = {
  entries: {
    orderBy: {
      order: 'asc' as const,
    },
  },
}

export const eventTimingRepository = {
  async listTimelines(userId: string, eventId: string) {
    return prisma.eventTimeline.findMany({
      where: { eventId, event: { userId } },
      include: timelineInclude,
      orderBy: { order: 'asc' },
    })
  },

  async seedDefaultTimeline(userId: string, eventId: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return []

    await prisma.eventTimeline.create({
      data: { eventId, title: DEFAULT_TIMELINE_TITLE, order: 0 },
    })

    return this.listTimelines(userId, eventId)
  },

  async createTimeline(userId: string, eventId: string, title: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return null

    const order = await prisma.eventTimeline.count({ where: { eventId, event: { userId } } })

    return prisma.eventTimeline.create({
      data: { eventId, title, order },
      include: timelineInclude,
    })
  },

  async createEntry(userId: string, eventId: string, input: CreateEntryInput) {
    const timeline = await prisma.eventTimeline.findFirst({
      where: { id: input.timelineId, eventId, event: { userId } },
      include: { _count: { select: { entries: true } } },
    })

    if (!timeline) return null

    return prisma.eventTimelineEntry.create({
      data: {
        timelineId: input.timelineId,
        startTime: input.startTime,
        endTime: input.endTime,
        title: input.title,
        location: input.location,
        participants: input.participants,
        comment: input.comment,
        order: timeline._count.entries,
      },
    })
  },

  updateEntry(userId: string, eventId: string, entryId: string, input: UpdateEntryInput) {
    return prisma.eventTimelineEntry.updateMany({
      where: { id: entryId, timeline: { eventId, event: { userId } } },
      data: input,
    })
  },

  findEntry(userId: string, eventId: string, entryId: string) {
    return prisma.eventTimelineEntry.findFirst({
      where: { id: entryId, timeline: { eventId, event: { userId } } },
    })
  },
}
