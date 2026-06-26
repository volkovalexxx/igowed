import { mapGuestRecord, type GuestRecord } from './eventGuest.mapper'
import { EventGuestValidationError, parseCreateGuestInput, parseUpdateGuestInput, type CreateGuestInput, type UpdateGuestInput } from './eventGuest.validation'

type EventGuestDeps = {
  listGuests(userId: string, eventId: string): Promise<GuestRecord[]>
  seedDefaultGuests(userId: string, eventId: string): Promise<GuestRecord[]>
  createGuest(userId: string, eventId: string, input: CreateGuestInput): Promise<GuestRecord | null>
  updateGuest(userId: string, eventId: string, guestId: string, input: UpdateGuestInput): Promise<{ count: number }>
  findGuest(userId: string, eventId: string, guestId: string): Promise<GuestRecord | null>
}

function ensureRecord<T>(record: T | null) {
  if (!record) {
    throw new EventGuestValidationError('Мероприятие или гость не найдены')
  }
  return record
}

export async function listGuestsForEvent(userId: string, eventId: string, deps: EventGuestDeps) {
  if (!userId || !eventId) return []

  const guests = await deps.listGuests(userId, eventId)
  if (guests.length > 0) return guests.map(mapGuestRecord)

  const seededGuests = await deps.seedDefaultGuests(userId, eventId)
  return seededGuests.map(mapGuestRecord)
}

export async function createGuestForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventGuestDeps) {
  const input = parseCreateGuestInput(rawInput)
  const guest = await deps.createGuest(userId, eventId, input)
  return mapGuestRecord(ensureRecord(guest))
}

export async function updateGuestForEvent(userId: string, eventId: string, guestId: string, rawInput: unknown, deps: EventGuestDeps) {
  const input = parseUpdateGuestInput(rawInput)
  const result = await deps.updateGuest(userId, eventId, guestId, input)
  if (result.count < 1) ensureRecord(null)

  const guest = await deps.findGuest(userId, eventId, guestId)
  return mapGuestRecord(ensureRecord(guest))
}

export function isEventGuestError(error: unknown): error is EventGuestValidationError {
  return error instanceof EventGuestValidationError
}
