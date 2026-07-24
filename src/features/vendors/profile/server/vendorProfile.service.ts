import { mapVendorProfile } from './vendorProfile.mapper'
import type { VendorProfile } from '../vendorProfile.types'

type VendorProfileDeps = {
  findVendorBySlug(slug: string): Promise<Parameters<typeof mapVendorProfile>[0] | null>
}

export async function getVendorProfile(slug: string, deps: VendorProfileDeps): Promise<VendorProfile | null> {
  if (!slug) return null

  const record = await deps.findVendorBySlug(slug)
  return record ? mapVendorProfile(record) : null
}
