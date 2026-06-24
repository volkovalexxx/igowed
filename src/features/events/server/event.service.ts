import { EventValidationError, parseCreateEventInput } from './event.validation'
import type { EventDeps, EventRecord } from './event.types'

export async function createEventForUser(userId: string, rawInput: unknown, deps: EventDeps): Promise<EventRecord> {
  const input = parseCreateEventInput(userId, rawInput)
  return deps.createEvent(input)
}

export async function getEventForUser(userId: string, eventId: string, deps: EventDeps): Promise<EventRecord | null> {
  if (!userId || !eventId || !deps.findEventById) return null
  return deps.findEventById(userId, eventId)
}

export async function listEventsForUser(userId: string, deps: EventDeps): Promise<EventRecord[]> {
  if (!userId || !deps.listEvents) return []
  return deps.listEvents(userId)
}

export function isEventError(error: unknown): error is EventValidationError {
  return error instanceof EventValidationError
}
