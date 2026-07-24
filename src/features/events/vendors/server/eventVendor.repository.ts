import prisma from '@/lib/prisma'
import type { AddVendorInput } from './eventVendor.validation'

const vendorInclude = {
  vendor: {
    select: {
      id: true,
      slug: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      isPro: true,
      rating: true,
    },
  },
}

export const eventVendorRepository = {
  listEventVendors(userId: string, eventId: string) {
    return prisma.eventVendor.findMany({
      where: { eventId, event: { userId } },
      include: vendorInclude,
      orderBy: { order: 'asc' },
    })
  },

  findVendor(vendorId: string) {
    return prisma.vendor.findFirst({ where: { id: vendorId, isActive: true }, select: { id: true } })
  },

  async addEventVendor(userId: string, eventId: string, input: AddVendorInput) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return null

    const exists = await prisma.eventVendor.findFirst({
      where: { eventId, vendorId: input.vendorId },
      select: { id: true },
    })
    if (exists) return null

    const order = await prisma.eventVendor.count({ where: { eventId } })

    return prisma.eventVendor.create({
      data: { eventId, vendorId: input.vendorId, role: input.role, order },
      include: vendorInclude,
    })
  },

  removeEventVendor(userId: string, eventId: string, vendorId: string) {
    return prisma.eventVendor.deleteMany({
      where: { eventId, vendorId, event: { userId } },
    })
  },
}
