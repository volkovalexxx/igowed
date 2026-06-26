import type { EventTask, TaskGroup, TaskPriority, TaskStatus } from '../eventTasks.types'

type TaskRecord = {
  id: string
  title: string
  priority: string
  deadline: Date | null
  status: string
  order: number
}

type TaskListRecord = {
  id: string
  title: string
  order: number
  tasks: TaskRecord[]
}

function formatDeadline(deadline: Date | null) {
  if (!deadline) return null
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(deadline)
}

function normalizePriority(priority: string): TaskPriority {
  if (priority === 'high' || priority === 'low') return priority
  return 'medium'
}

function normalizeStatus(status: string): TaskStatus {
  return status === 'done' ? 'done' : 'open'
}

export function mapTaskRecord(task: TaskRecord): EventTask {
  return {
    id: task.id,
    title: task.title,
    priority: normalizePriority(task.priority),
    deadline: formatDeadline(task.deadline),
    status: normalizeStatus(task.status),
    order: task.order,
  }
}

export function mapTaskListRecord(list: TaskListRecord): TaskGroup {
  return {
    id: list.id,
    title: list.title,
    order: list.order,
    tasks: list.tasks.map(mapTaskRecord),
  }
}
