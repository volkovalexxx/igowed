import prisma from '@/lib/prisma'

export const productCardRepository = {
  findProductBySlug(slug: string) {
    return prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: { select: { name: true, slug: true } },
        photos: { orderBy: { order: 'asc' } },
        attributes: { orderBy: { order: 'asc' } },
        vendor: { select: { userId: true, slug: true, firstName: true, lastName: true, username: true } },
      },
    })
  },
}
