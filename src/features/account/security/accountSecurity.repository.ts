import prisma from '@/lib/prisma'

export const accountSecurityRepository = {
  async findPasswordHash(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } })
    return user?.password ?? null
  },

  async updatePassword(userId: string, hash: string): Promise<void> {
    await prisma.user.update({ where: { id: userId }, data: { password: hash } })
  },
}
