import prisma from '@/lib/prisma'
import type { CreatedBooking } from '../booking.types'
import type { BookingVendor } from './booking.service'

export const bookingRepository = {
  async findVendorBySlug(slug: string): Promise<BookingVendor | null> {
    const vendor = await prisma.vendor.findUnique({ where: { slug }, select: { id: true, userId: true } })
    return vendor ?? null
  },

  async findActiveBooking(userId: string, vendorId: string): Promise<{ id: string; status: CreatedBooking['status'] } | null> {
    const booking = await prisma.booking.findFirst({
      where: { userId, vendorId, status: { in: ['PENDING', 'CONFIRMED'] } },
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true },
    })
    return booking ?? null
  },

  async createBooking(userId: string, vendorId: string, date: string | null, message: string | null) {
    return prisma.booking.create({
      data: { userId, vendorId, date: date ? new Date(date) : null, message },
      select: { id: true, status: true },
    })
  },
}
