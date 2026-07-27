import prisma from '@/lib/prisma'

export const accountDeleteRepository = {
  deleteUser(userId: string) {
    return prisma.user.deleteMany({ where: { id: userId } })
  },
}
