import prisma from '@/lib/prisma'

export const reviewCreateRepository = {
  async findVendorIdBySlug(slug: string): Promise<string | null> {
    const vendor = await prisma.vendor.findUnique({ where: { slug }, select: { id: true } })
    return vendor?.id ?? null
  },

  async hasCompletedBooking(userId: string, vendorId: string): Promise<boolean> {
    const count = await prisma.booking.count({ where: { userId, vendorId, status: 'COMPLETED' } })
    return count > 0
  },

  async findDirectReviewId(userId: string, vendorId: string): Promise<string | null> {
    const review = await prisma.review.findFirst({ where: { userId, vendorId, eventId: null }, select: { id: true } })
    return review?.id ?? null
  },

  createReview(input: { userId: string; vendorId: string; rating: number; text: string | null }) {
    return prisma.review.create({
      data: { userId: input.userId, vendorId: input.vendorId, eventId: null, rating: input.rating, text: input.text },
      select: { id: true, rating: true },
    })
  },

  updateReview(reviewId: string, rating: number, text: string | null) {
    return prisma.review.update({ where: { id: reviewId }, data: { rating, text }, select: { id: true, rating: true } })
  },

  /** Держим денормализованные `rating` и `reviewCount` подрядчика в согласии с отзывами. */
  async refreshVendorRating(vendorId: string): Promise<void> {
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
