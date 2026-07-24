import { buildVendorSlots } from '../eventVendors.format'
import { mapEventVendorEntry } from './eventVendor.mapper'
import { EventVendorValidationError, parseAddVendorInput } from './eventVendor.validation'

type EventVendorDeps = {
  listEventVendors(userId: string, eventId: string): Promise<Parameters<typeof mapEventVendorEntry>[0][]>
  findVendor(vendorId: string): Promise<{ id: string } | null>
  addEventVendor(
    userId: string,
    eventId: string,
    input: ReturnType<typeof parseAddVendorInput>,
  ): Promise<Parameters<typeof mapEventVendorEntry>[0] | null>
  removeEventVendor(userId: string, eventId: string, vendorId: string): Promise<{ count: number }>
}

export async function listEventVendorSlots(userId: string, eventId: string, deps: EventVendorDeps) {
  if (!userId || !eventId) return buildVendorSlots([])

  const records = await deps.listEventVendors(userId, eventId)
  return buildVendorSlots(records.map(mapEventVendorEntry))
}

export async function addVendorToEvent(userId: string, eventId: string, rawInput: unknown, deps: EventVendorDeps) {
  const input = parseAddVendorInput(rawInput)

  const vendor = await deps.findVendor(input.vendorId)
  if (!vendor) {
    throw new EventVendorValidationError('Подрядчик не найден')
  }

  const record = await deps.addEventVendor(userId, eventId, input)
  if (!record) {
    throw new EventVendorValidationError('Не удалось привязать подрядчика к мероприятию')
  }

  return mapEventVendorEntry(record)
}

export async function removeVendorFromEvent(userId: string, eventId: string, vendorId: string, deps: EventVendorDeps) {
  const result = await deps.removeEventVendor(userId, eventId, vendorId)
  if (result.count < 1) {
    throw new EventVendorValidationError('Подрядчик не найден среди участников мероприятия')
  }
}

export function isEventVendorError(error: unknown): error is EventVendorValidationError {
  return error instanceof EventVendorValidationError
}
