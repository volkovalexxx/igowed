import prisma from '@/lib/prisma'

const userRefSelect = {
  id: true,
  name: true,
  image: true,
  vendor: { select: { avatar: true } },
}

const messageInclude = {
  sender: { select: userRefSelect },
  receiver: { select: userRefSelect },
}

export const chatRepository = {
  listUserMessages(userId: string) {
    return prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: messageInclude,
      orderBy: { createdAt: 'desc' },
    })
  },

  findUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: userRefSelect,
    })
  },

  listThreadMessages(userId: string, otherUserId: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: messageInclude,
      orderBy: { createdAt: 'asc' },
    })
  },

  async markThreadRead(senderId: string, receiverId: string) {
    await prisma.message.updateMany({
      where: { senderId, receiverId, isRead: false },
      data: { isRead: true },
    })
  },

  createMessage(senderId: string, receiverId: string, text: string) {
    return prisma.message.create({
      data: { senderId, receiverId, text },
      include: messageInclude,
    })
  },
}
