import prisma from '@/lib/prisma'
import type { GalleryPhoto } from '../gallery.types'

const photoSelect = { id: true, url: true, thumb: true, order: true, isAvatar: true }

export const galleryRepository = {
  async findVendorIdForUser(userId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { userId }, select: { id: true } })
    return vendor?.id ?? null
  },

  listByVendor(vendorId: string): Promise<GalleryPhoto[]> {
    return prisma.photo.findMany({ where: { vendorId }, orderBy: { order: 'asc' }, select: photoSelect })
  },

  countByVendor(vendorId: string) {
    return prisma.photo.count({ where: { vendorId } })
  },

  createPhoto(vendorId: string, url: string, order: number): Promise<GalleryPhoto> {
    return prisma.photo.create({ data: { vendorId, url, order }, select: photoSelect })
  },

  deleteOwned(vendorId: string, photoId: string) {
    return prisma.photo.deleteMany({ where: { id: photoId, vendorId } })
  },

  async clearMain(vendorId: string) {
    await prisma.photo.updateMany({ where: { vendorId, isAvatar: true }, data: { isAvatar: false } })
  },

  setMain(vendorId: string, photoId: string) {
    return prisma.photo.updateMany({ where: { id: photoId, vendorId }, data: { isAvatar: true } })
  },
}
