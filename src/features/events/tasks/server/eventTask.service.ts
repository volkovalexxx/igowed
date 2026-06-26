import { mapTaskListRecord, mapTaskRecord } from './eventTask.mapper'
import { EventTaskValidationError, parseCreateTaskInput, parseCreateTaskListInput, parseUpdateTaskInput } from './eventTask.validation'

type EventTaskDeps = {
  listTaskGroups(userId: string, eventId: string): Promise<Parameters<typeof mapTaskListRecord>[0][]>
  seedDefaultTaskGroups(userId: string, eventId: string): Promise<Parameters<typeof mapTaskListRecord>[0][]>
  createTaskList(userId: string, eventId: string, title: string): Promise<Parameters<typeof mapTaskListRecord>[0] | null>
  createTask(userId: string, eventId: string, input: ReturnType<typeof parseCreateTaskInput>): Promise<Parameters<typeof mapTaskRecord>[0] | null>
  updateTask(userId: string, eventId: string, taskId: string, input: ReturnType<typeof parseUpdateTaskInput>): Promise<{ count: number }>
  findTask(userId: string, eventId: string, taskId: string): Promise<Parameters<typeof mapTaskRecord>[0] | null>
}

function ensureAccess<T>(record: T | null) {
  if (!record) {
    throw new EventTaskValidationError('Мероприятие или задача не найдены')
  }
  return record
}

export async function listTaskGroupsForEvent(userId: string, eventId: string, deps: EventTaskDeps) {
  if (!userId || !eventId) return []

  const groups = await deps.listTaskGroups(userId, eventId)
  if (groups.length > 0) return groups.map(mapTaskListRecord)

  const seededGroups = await deps.seedDefaultTaskGroups(userId, eventId)
  return seededGroups.map(mapTaskListRecord)
}

export async function createTaskListForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventTaskDeps) {
  const input = parseCreateTaskListInput(rawInput)
  const list = await deps.createTaskList(userId, eventId, input.title)
  return mapTaskListRecord(ensureAccess(list))
}

export async function createTaskForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventTaskDeps) {
  const input = parseCreateTaskInput(rawInput)
  const task = await deps.createTask(userId, eventId, input)
  return mapTaskRecord(ensureAccess(task))
}

export async function updateTaskForEvent(userId: string, eventId: string, taskId: string, rawInput: unknown, deps: EventTaskDeps) {
  const input = parseUpdateTaskInput(rawInput)
  const result = await deps.updateTask(userId, eventId, taskId, input)
  if (result.count < 1) ensureAccess(null)

  const task = await deps.findTask(userId, eventId, taskId)
  return mapTaskRecord(ensureAccess(task))
}

export function isEventTaskError(error: unknown): error is EventTaskValidationError {
  return error instanceof EventTaskValidationError
}
