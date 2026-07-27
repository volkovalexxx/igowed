import prisma from '@/lib/prisma'
import type { OrderStatus, VendorOrder } from '../orders.types'

type BookingRow = {
  id: string
  userId: string
  date: Date | null
  message: string | null
  status: OrderStatus
  user: { name: string | null; email: string; image: string | null }
}

function toOrder(row: BookingRow): VendorOrder {
  const email = row.user.email
  return {
    id: row.id,
    clientId: row.userId,
    clientName: row.user.name?.trim() || email.split('@')[0],
    clientContact: email,
    clientAvatar: row.user.image,
    date: row.date ? row.date.toISOString() : null,
    message: row.message,
    status: row.status,
  }
}

export const ordersRepository = {
  async findVendorIdForUser(userId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { userId }, select: { id: true } })
    return vendor?.id ?? null
  },

  async listByVendor(vendorId: string): Promise<VendorOrder[]> {
    const rows = await prisma.booking.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        date: true,
        message: true,
        status: true,
        user: { select: { name: true, email: true, image: true } },
      },
    })
    return rows.map(toOrder)
  },

  async findStatusOwned(vendorId: string, bookingId: string): Promise<OrderStatus | null> {
    const booking = await prisma.booking.findFirst({ where: { id: bookingId, vendorId }, select: { status: true } })
    return booking?.status ?? null
  },

  updateStatusOwned(vendorId: string, bookingId: string, status: OrderStatus) {
    return prisma.booking.updateMany({ where: { id: bookingId, vendorId }, data: { status } })
  },
}
