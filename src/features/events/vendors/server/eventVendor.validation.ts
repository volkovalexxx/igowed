import { isVendorRole } from '../eventVendors.format'

export class EventVendorValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventVendorValidationError'
  }
}

export type AddVendorInput = {
  vendorId: string
  role: string
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

export function parseAddVendorInput(raw: unknown): AddVendorInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventVendorValidationError('Некорректные данные подрядчика')
  }

  const data = raw as Record<string, unknown>
  const vendorId = cleanString(data.vendorId)
  const role = cleanString(data.role)

  if (!vendorId) {
    throw new EventVendorValidationError('Выберите подрядчика')
  }

  if (!role || !isVendorRole(role)) {
    throw new EventVendorValidationError('Выберите роль из списка')
  }

  return { vendorId, role }
}
