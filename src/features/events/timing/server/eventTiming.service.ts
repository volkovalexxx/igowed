import { compareTimes } from '../eventTiming.format'
import { mapTimelineEntryRecord, mapTimelineRecord } from './eventTiming.mapper'
import {
  EventTimingValidationError,
  parseCreateEntryInput,
  parseCreateTimelineInput,
  parseUpdateEntryInput,
} from './eventTiming.validation'

type EventTimingDeps = {
  listTimelines(userId: string, eventId: string): Promise<Parameters<typeof mapTimelineRecord>[0][]>
  seedDefaultTimeline(userId: string, eventId: string): Promise<Parameters<typeof mapTimelineRecord>[0][]>
  createTimeline(userId: string, eventId: string, title: string): Promise<Parameters<typeof mapTimelineRecord>[0] | null>
  createEntry(
    userId: string,
    eventId: string,
    input: ReturnType<typeof parseCreateEntryInput>,
  ): Promise<Parameters<typeof mapTimelineEntryRecord>[0] | null>
  updateEntry(
    userId: string,
    eventId: string,
    entryId: string,
    input: ReturnType<typeof parseUpdateEntryInput>,
  ): Promise<{ count: number }>
  findEntry(userId: string, eventId: string, entryId: string): Promise<Parameters<typeof mapTimelineEntryRecord>[0] | null>
}

function ensureAccess<T>(record: T | null) {
  if (!record) {
    throw new EventTimingValidationError('Мероприятие или событие не найдены')
  }
  return record
}

export async function listTimelinesForEvent(userId: string, eventId: string, deps: EventTimingDeps) {
  if (!userId || !eventId) return []

  const timelines = await deps.listTimelines(userId, eventId)
  if (timelines.length > 0) return timelines.map(mapTimelineRecord)

  const seeded = await deps.seedDefaultTimeline(userId, eventId)
  return seeded.map(mapTimelineRecord)
}

export async function createTimelineForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventTimingDeps) {
  const input = parseCreateTimelineInput(rawInput)
  const timeline = await deps.createTimeline(userId, eventId, input.title)
  return mapTimelineRecord(ensureAccess(timeline))
}

export async function createTimelineEntryForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventTimingDeps) {
  const input = parseCreateEntryInput(rawInput)
  const entry = await deps.createEntry(userId, eventId, input)
  return mapTimelineEntryRecord(ensureAccess(entry))
}

/**
 * Инвариант «окончание не раньше начала» проверяется по слитому состоянию
 * «событие из БД + патч»: PATCH может прислать только одну границу.
 */
export async function updateTimelineEntryForEvent(
  userId: string,
  eventId: string,
  entryId: string,
  rawInput: unknown,
  deps: EventTimingDeps,
) {
  const input = parseUpdateEntryInput(rawInput)
  const current = ensureAccess(await deps.findEntry(userId, eventId, entryId))

  const startTime = input.startTime ?? current.startTime
  const endTime = input.endTime ?? current.endTime

  if (compareTimes(endTime, startTime) < 0) {
    throw new EventTimingValidationError('Окончание не может быть раньше начала')
  }

  const result = await deps.updateEntry(userId, eventId, entryId, input)
  if (result.count < 1) ensureAccess(null)

  return mapTimelineEntryRecord(ensureAccess(await deps.findEntry(userId, eventId, entryId)))
}

export function isEventTimingError(error: unknown): error is EventTimingValidationError {
  return error instanceof EventTimingValidationError
}
