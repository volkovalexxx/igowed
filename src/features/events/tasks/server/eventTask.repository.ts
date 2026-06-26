import prisma from '@/lib/prisma'
import { defaultTaskGroups } from '../eventTasks.data'
import { parseDeadline } from './eventTask.validation'

const listInclude = {
  tasks: {
    orderBy: {
      order: 'asc' as const,
    },
  },
}

export const eventTaskRepository = {
  async listTaskGroups(userId: string, eventId: string) {
    return prisma.eventTaskList.findMany({
      where: {
        eventId,
        event: {
          userId,
        },
      },
      include: listInclude,
      orderBy: {
        order: 'asc',
      },
    })
  },

  async seedDefaultTaskGroups(userId: string, eventId: string) {
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
      defaultTaskGroups.map((group) =>
        prisma.eventTaskList.create({
          data: {
            eventId,
            title: group.title,
            order: group.order,
            tasks: {
              create: group.tasks.map((task) => ({
                title: task.title,
                priority: task.priority,
                deadline: parseDeadline(task.deadline),
                status: task.status,
                order: task.order,
              })),
            },
          },
        }),
      ),
    )

    return this.listTaskGroups(userId, eventId)
  },

  async createTaskList(userId: string, eventId: string, title: string) {
    const listsCount = await prisma.eventTaskList.count({
      where: {
        eventId,
        event: {
          userId,
        },
      },
    })

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
      },
      select: {
        id: true,
      },
    })

    if (!event) return null

    return prisma.eventTaskList.create({
      data: {
        eventId,
        title,
        order: listsCount,
      },
      include: listInclude,
    })
  },

  async createTask(userId: string, eventId: string, input: { listId: string; title: string; priority: string; deadline: Date | null }) {
    const list = await prisma.eventTaskList.findFirst({
      where: {
        id: input.listId,
        eventId,
        event: {
          userId,
        },
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    })

    if (!list) return null

    return prisma.eventTask.create({
      data: {
        listId: input.listId,
        title: input.title,
        priority: input.priority,
        deadline: input.deadline,
        status: 'open',
        order: list._count.tasks,
      },
    })
  },

  updateTask(userId: string, eventId: string, taskId: string, input: { title?: string; priority?: string; deadline?: Date | null; status?: string }) {
    return prisma.eventTask.updateMany({
      where: {
        id: taskId,
        list: {
          eventId,
          event: {
            userId,
          },
        },
      },
      data: input,
    })
  },

  findTask(userId: string, eventId: string, taskId: string) {
    return prisma.eventTask.findFirst({
      where: {
        id: taskId,
        list: {
          eventId,
          event: {
            userId,
          },
        },
      },
    })
  },
}
