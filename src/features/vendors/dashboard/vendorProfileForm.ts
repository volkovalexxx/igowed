import type { BusinessType, ProfileFormData, VendorProfilePatch, VendorProfileRecord } from './vendorProfileForm.types'

const BUSINESS_TYPES: BusinessType[] = ['IP', 'OOO', 'INDIVIDUAL']

export function parseWorkingHours(value: string | null): { from: string; to: string } {
  const match = value?.match(/(\d{1,2}:\d{2})\D+(\d{1,2}:\d{2})/)
  if (!match) return { from: '', to: '' }
  return { from: match[1], to: match[2] }
}

export function formatWorkingHours(from: string, to: string): string {
  if (!from || !to) return ''
  return `с ${from} до ${to}`
}

function businessType(value: string | null): BusinessType {
  return BUSINESS_TYPES.includes(value as BusinessType) ? (value as BusinessType) : 'INDIVIDUAL'
}

export function mapVendorToProfileForm(vendor: VendorProfileRecord): ProfileFormData {
  const hours = parseWorkingHours(vendor.workingHours)

  return {
    firstName: vendor.firstName,
    lastName: vendor.lastName,
    activity: vendor.specializations[0] ?? 'Фотограф',
    languages: vendor.languages,
    login: vendor.username,
    country: vendor.country,
    cities: vendor.cities,
    phone: vendor.phone ?? '',
    phone2: vendor.phone2 ?? '',
    specializations: vendor.specializations,
    website: vendor.website ?? '',
    instagram: vendor.instagram ?? '',
    descriptionPhotographer: vendor.bio ?? '',
    descriptionTransport: '',
    displayMode: vendor.galleryDisplay,
    cardMode: vendor.cardDisplay,
    address: vendor.address ?? '',
    contactPhone: vendor.phone ?? '',
    bankDetails: vendor.bankDetails ?? '',
    activityType: businessType(vendor.businessType),
    workFrom: hours.from,
    workTo: hours.to,
  }
}

export function mapProfileFormToPatch(form: ProfileFormData): VendorProfilePatch {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    username: form.login.trim(),
    bio: form.descriptionPhotographer.trim(),
    country: form.country.trim(),
    cities: form.cities,
    phone: form.phone.trim(),
    phone2: form.phone2.trim(),
    website: form.website.trim(),
    instagram: form.instagram.trim(),
    address: form.address.trim(),
    businessType: form.activityType,
    bankDetails: form.bankDetails.trim(),
    workingHours: formatWorkingHours(form.workFrom, form.workTo),
    languages: form.languages,
    galleryDisplay: form.displayMode,
    cardDisplay: form.cardMode,
    specializations: form.specializations,
  }
}
