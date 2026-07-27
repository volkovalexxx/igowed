import prisma from '@/lib/prisma'
import type { OrderStatus } from '@/features/vendors/orders/orders.types'
import type { ClientBooking } from '../clientBooking.types'

export const clientBookingsRepository = {
  async listByUser(userId: string): Promise<ClientBooking[]> {
    const rows = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        date: true,
        message: true,
        status: true,
        vendor: { select: { id: true, slug: true, firstName: true, lastName: true, avatar: true } },
      },
    })

    // Один запрос: по каким подрядчикам этот клиент уже оставил прямой отзыв.
    const vendorIds = [...new Set(rows.map((row) => row.vendor.id))]
    const reviews = vendorIds.length
      ? await prisma.review.findMany({ where: { userId, eventId: null, vendorId: { in: vendorIds } }, select: { vendorId: true } })
      : []
    const reviewed = new Set(reviews.map((review) => review.vendorId))

    return rows.map((row) => ({
      id: row.id,
      vendorName: `${row.vendor.firstName} ${row.vendor.lastName}`.trim(),
      vendorAvatar: row.vendor.avatar,
      vendorSlug: row.vendor.slug,
      date: row.date ? row.date.toISOString() : null,
      message: row.message,
      status: row.status,
      alreadyReviewed: reviewed.has(row.vendor.id),
    }))
  },

  async findStatusOwnedByUser(userId: string, bookingId: string): Promise<OrderStatus | null> {
    const booking = await prisma.booking.findFirst({ where: { id: bookingId, userId }, select: { status: true } })
    return booking?.status ?? null
  },

  cancelOwnedByUser(userId: string, bookingId: string) {
    // Статус в where — на случай гонки: подрядчик мог завершить заявку между проверкой и отменой.
    return prisma.booking.updateMany({
      where: { id: bookingId, userId, status: { in: ['PENDING', 'CONFIRMED'] } },
      data: { status: 'CANCELLED' },
    })
  },
}
