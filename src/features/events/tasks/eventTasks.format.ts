import type { EventTask, TaskPriority, TaskStatus } from './eventTasks.types'
import { priorityLabels } from './eventTasks.data'

export function getTaskStatusLabel(status: TaskStatus) {
  return status === 'done' ? 'завершена' : 'не завершена'
}

export function getPriorityLabel(priority: TaskPriority) {
  return priorityLabels[priority]
}

export function filterTasksByStatus(tasks: EventTask[], status: 'all' | TaskStatus) {
  if (status === 'all') return tasks
  return tasks.filter((task) => task.status === status)
}
