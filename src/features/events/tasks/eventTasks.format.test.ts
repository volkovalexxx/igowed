import { describe, expect, it } from 'vitest'
import { filterTasksByStatus, getPriorityLabel, getTaskStatusLabel } from './eventTasks.format'
import type { EventTask } from './eventTasks.types'

const tasks: EventTask[] = [
  { id: 'one', title: 'One', priority: 'high', deadline: '29.02.2026', status: 'open' },
  { id: 'two', title: 'Two', priority: 'low', deadline: '29.02.2026', status: 'done' },
]

describe('event task helpers', () => {
  it('formats status and priority labels', () => {
    expect(getTaskStatusLabel('done')).toBe('завершена')
    expect(getTaskStatusLabel('open')).toBe('не завершена')
    expect(getPriorityLabel('medium')).toBe('Средний приоритет')
  })

  it('filters tasks by status', () => {
    expect(filterTasksByStatus(tasks, 'all')).toHaveLength(2)
    expect(filterTasksByStatus(tasks, 'done')).toEqual([tasks[1]])
    expect(filterTasksByStatus(tasks, 'open')).toEqual([tasks[0]])
  })
})
