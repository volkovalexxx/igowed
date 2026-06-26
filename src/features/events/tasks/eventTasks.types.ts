export type TaskPriority = 'high' | 'medium' | 'low'

export type TaskStatus = 'done' | 'open'

export type EventTask = {
  id: string
  title: string
  priority: TaskPriority
  deadline: string | null
  status: TaskStatus
  order: number
}

export type TaskGroup = {
  id: string
  title: string
  order: number
  tasks: EventTask[]
}
