export type TaskPriority = 'high' | 'medium' | 'low'

export type TaskStatus = 'done' | 'open'

export type EventTask = {
  id: string
  title: string
  priority: TaskPriority
  deadline: string
  status: TaskStatus
}

export type TaskGroup = {
  id: string
  title: string
  tasks: EventTask[]
}
