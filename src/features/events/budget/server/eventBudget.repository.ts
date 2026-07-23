import prisma from '@/lib/prisma'
import { DEFAULT_BUDGET_CATEGORIES } from '../eventBudget.data'
import type { CreateItemInput, UpdateItemInput } from './eventBudget.validation'

const categoryInclude = {
  items: {
    orderBy: {
      order: 'asc' as const,
    },
  },
}

export const eventBudgetRepository = {
  async findSummaryCurrency(userId: string, eventId: string) {
    const event = await prisma.event.findFirst({
      where: { id: eventId, userId },
      select: { budgetCurrency: true },
    })

    return event?.budgetCurrency ?? null
  },

  async listCategories(userId: string, eventId: string) {
    return prisma.eventBudgetCategory.findMany({
      where: { eventId, event: { userId } },
      include: categoryInclude,
      orderBy: { order: 'asc' },
    })
  },

  async seedDefaultCategories(userId: string, eventId: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return []

    await prisma.$transaction(
      DEFAULT_BUDGET_CATEGORIES.map((category) =>
        prisma.eventBudgetCategory.create({
          data: { eventId, title: category.title, order: category.order },
        }),
      ),
    )

    return this.listCategories(userId, eventId)
  },

  async createCategory(userId: string, eventId: string, title: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return null

    const order = await prisma.eventBudgetCategory.count({ where: { eventId, event: { userId } } })

    return prisma.eventBudgetCategory.create({
      data: { eventId, title, order },
      include: categoryInclude,
    })
  },

  async createItem(userId: string, eventId: string, input: CreateItemInput) {
    const category = await prisma.eventBudgetCategory.findFirst({
      where: { id: input.categoryId, eventId, event: { userId } },
      include: { _count: { select: { items: true } } },
    })

    if (!category) return null

    return prisma.eventBudgetItem.create({
      data: {
        categoryId: input.categoryId,
        title: input.title,
        cost: input.cost,
        paid: input.paid,
        currency: input.currency,
        order: category._count.items,
      },
    })
  },

  updateItem(userId: string, eventId: string, itemId: string, input: UpdateItemInput) {
    return prisma.eventBudgetItem.updateMany({
      where: { id: itemId, category: { eventId, event: { userId } } },
      data: input,
    })
  },

  findItem(userId: string, eventId: string, itemId: string) {
    return prisma.eventBudgetItem.findFirst({
      where: { id: itemId, category: { eventId, event: { userId } } },
    })
  },
}
