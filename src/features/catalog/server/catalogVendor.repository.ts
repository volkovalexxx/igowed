import prisma from '@/lib/prisma'

export const catalogVendorRepository = {
  listActiveVendors() {
    return prisma.vendor.findMany({
      where: { isActive: true },
      include: {
        specializations: { select: { name: true } },
        services: { include: { category: { select: { name: true } } } },
        photos: { orderBy: { order: 'asc' }, take: 4 },
      },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    })
  },
}
