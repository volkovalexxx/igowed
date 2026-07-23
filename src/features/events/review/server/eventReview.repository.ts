import prisma from '@/lib/prisma'

const eventVendorInclude = {
  vendor: {
    include: {
      photos: { orderBy: { order: 'asc' as const }, take: 1 },
    },
  },
}

export const eventReviewRepository = {
  listEventVendors(userId: string, eventId: string) {
    return prisma.eventVendor.findMany({
      where: { eventId, event: { userId } },
      include: eventVendorInclude,
      orderBy: { order: 'asc' },
    })
  },

  listUserReviews(userId: string, eventId: string) {
    return prisma.review.findMany({
      where: { userId, eventId },
      select: { vendorId: true, rating: true },
    })
  },

  findEventVendor(userId: string, eventId: string, vendorId: string) {
    return prisma.eventVendor.findFirst({
      where: { eventId, vendorId, event: { userId } },
      include: eventVendorInclude,
    })
  },

  async upsertReview(input: { userId: string; eventId: string; vendorId: string; rating: number; text: string | null }) {
    const existing = await prisma.review.findFirst({
      where: { userId: input.userId, eventId: input.eventId, vendorId: input.vendorId },
      select: { id: true },
    })

    if (existing) {
      return prisma.review.update({
        where: { id: existing.id },
        data: { rating: input.rating, text: input.text },
        select: { id: true, vendorId: true, rating: true },
      })
    }

    return prisma.review.create({
      data: {
        userId: input.userId,
        eventId: input.eventId,
        vendorId: input.vendorId,
        rating: input.rating,
        text: input.text,
      },
      select: { id: true, vendorId: true, rating: true },
    })
  },

  /** Держим денормализованные `rating` и `reviewCount` подрядчика в согласии с отзывами. */
  async refreshVendorRating(vendorId: string) {
    const stats = await prisma.review.aggregate({
      where: { vendorId },
      _avg: { rating: true },
      _count: { _all: true },
    })

    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        rating: Number((stats._avg.rating ?? 0).toFixed(2)),
        reviewCount: stats._count._all,
      },
    })
  },
}
