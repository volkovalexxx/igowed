import { VENDOR_SLOT_ROLES } from './eventVendors.data'
import type { EventVendorEntry, EventVendorSlot } from './eventVendors.types'

export function isVendorRole(role: string): boolean {
  return (VENDOR_SLOT_ROLES as readonly string[]).includes(role)
}

/**
 * Раскладывает привязанных подрядчиков по слотам-ролям. Стандартные роли идут в порядке
 * макета всегда, даже пустыми; нестандартная роль получает свой слот в конце.
 */
export function buildVendorSlots(entries: readonly EventVendorEntry[]): EventVendorSlot[] {
  const byRole = new Map<string, EventVendorEntry[]>()

  for (const role of VENDOR_SLOT_ROLES) {
    byRole.set(role, [])
  }

  for (const entry of entries) {
    const bucket = byRole.get(entry.role)
    if (bucket) {
      bucket.push(entry)
    } else {
      byRole.set(entry.role, [entry])
    }
  }

  return [...byRole.entries()].map(([role, vendors]) => ({ role, vendors, isEmpty: vendors.length === 0 }))
}
