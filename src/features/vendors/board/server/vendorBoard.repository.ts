import prisma from '@/lib/prisma'
import { mapBoardVendorRecord } from './vendorBoard.mapper'

const vendorInclude = {
  photos: { orderBy: { order: 'asc' as const }, take: 1 },
  services: { include: { category: true, service: true }, take: 1 },
}

const popularOrder = [{ rating: 'desc' as const }, { createdAt: 'desc' as const }]

export const vendorBoardRepository = {
  async listFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { vendor: { include: vendorInclude } },
      orderBy: { createdAt: 'desc' },
    })

    return favorites.map((favorite) => mapBoardVendorRecord(favorite.vendor))
  },

  async listShortlist(userId: string) {
    const items = await prisma.shortlistItem.findMany({
      where: { userId },
      include: { vendor: { include: vendorInclude } },
      orderBy: { createdAt: 'desc' },
    })

    return items.map((item) => mapBoardVendorRecord(item.vendor))
  },

  async listPopular(take: number) {
    const vendors = await prisma.vendor.findMany({
      where: { isActive: true },
      include: vendorInclude,
      orderBy: popularOrder,
      take,
    })

    return vendors.map(mapBoardVendorRecord)
  },
}
