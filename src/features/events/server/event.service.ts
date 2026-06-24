import { EventValidationError, parseCreateEventInput } from './event.validation'
import type { EventDeps, EventRecord } from './event.types'

export async function createEventForUser(userId: string, rawInput: unknown, deps: EventDeps): Promise<EventRecord> {
  const input = parseCreateEventInput(userId, rawInput)
  return deps.createEvent(input)
}

export function isEventError(error: unknown): error is EventValidationError {
  return error instanceof EventValidationError
}
