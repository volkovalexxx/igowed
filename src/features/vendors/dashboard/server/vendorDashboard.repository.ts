import prisma from '@/lib/prisma'
import type { DisplayMode, VendorProfileRecord } from '../vendorProfileForm.types'

export const vendorDashboardRepository = {
  async findByUserId(userId: string): Promise<VendorProfileRecord | null> {
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: { specializations: { select: { name: true } } },
    })

    if (!vendor) return null

    return {
      id: vendor.id,
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      username: vendor.username,
      bio: vendor.bio,
      country: vendor.country,
      cities: vendor.cities,
      phone: vendor.phone,
      phone2: vendor.phone2,
      website: vendor.website,
      instagram: vendor.instagram,
      address: vendor.address,
      businessType: vendor.businessType,
      bankDetails: vendor.bankDetails,
      workingHours: vendor.workingHours,
      languages: vendor.languages,
      galleryDisplay: vendor.galleryDisplay as DisplayMode,
      cardDisplay: vendor.cardDisplay as DisplayMode,
      specializations: vendor.specializations.map((item) => item.name),
    }
  },
}
