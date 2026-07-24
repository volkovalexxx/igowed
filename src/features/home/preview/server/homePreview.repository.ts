import prisma from '@/lib/prisma'

const VENDOR_PREVIEW_TAKE = 6
const BLOG_PREVIEW_TAKE = 4

export const homePreviewRepository = {
  listTopVendors() {
    return prisma.vendor.findMany({
      where: { isActive: true },
      include: {
        specializations: { select: { name: true } },
        services: { include: { category: { select: { name: true } } }, take: 1 },
        photos: { orderBy: { order: 'asc' }, take: 1 },
      },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      take: VENDOR_PREVIEW_TAKE,
    })
  },

  listRecentPosts() {
    return prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
      take: BLOG_PREVIEW_TAKE,
    })
  },
}
