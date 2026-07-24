import prisma from '@/lib/prisma'

export const blogPostRepository = {
  listPosts() {
    return prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
    })
  },

  findPostBySlug(slug: string) {
    return prisma.blogPost.findUnique({
      where: { slug },
    })
  },
}
