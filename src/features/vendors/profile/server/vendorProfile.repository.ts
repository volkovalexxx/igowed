import prisma from '@/lib/prisma'

export const vendorProfileRepository = {
  findVendorBySlug(slug: string) {
    return prisma.vendor.findFirst({
      where: { slug, isActive: true },
      include: {
        photos: { orderBy: { order: 'asc' } },
        services: { include: { category: true }, orderBy: { price: 'asc' } },
        reviews: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: 'desc' } },
      },
    })
  },
}
