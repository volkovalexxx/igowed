import { describe, expect, it, vi } from 'vitest'
import { createTaskForEvent, createTaskListForEvent, listTaskGroupsForEvent, updateTaskForEvent } from './eventTask.service'

const deadline = new Date('2026-02-28T00:00:00.000Z')

const taskRecord = {
  id: 'task-1',
  title: 'Выбрать ведущего',
  priority: 'high',
  deadline,
  status: 'open',
  order: 0,
}

const listRecord = {
  id: 'list-1',
  title: 'Организация шоу-программы',
  order: 0,
  tasks: [taskRecord],
}

describe('event task service', () => {
  it('returns stored task groups without seeding', async () => {
    const deps = {
      listTaskGroups: vi.fn(async () => [listRecord]),
      seedDefaultTaskGroups: vi.fn(async () => []),
      createTaskList: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      findTask: vi.fn(),
    }

    await expect(listTaskGroupsForEvent('user-1', 'event-1', deps)).resolves.toEqual([
      {
        id: 'list-1',
        title: 'Организация шоу-программы',
        order: 0,
        tasks: [
          {
            id: 'task-1',
            title: 'Выбрать ведущего',
            priority: 'high',
            deadline: '28.02.2026',
            status: 'open',
            order: 0,
          },
        ],
      },
    ])
    expect(deps.seedDefaultTaskGroups).not.toHaveBeenCalled()
  })

  it('seeds defaults for an empty event', async () => {
    const deps = {
      listTaskGroups: vi.fn(async () => []),
      seedDefaultTaskGroups: vi.fn(async () => [listRecord]),
      createTaskList: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      findTask: vi.fn(),
    }

    const groups = await listTaskGroupsForEvent('user-1', 'event-1', deps)

    expect(groups).toHaveLength(1)
    expect(deps.seedDefaultTaskGroups).toHaveBeenCalledWith('user-1', 'event-1')
  })

  it('creates a task list for an event', async () => {
    const deps = {
      listTaskGroups: vi.fn(),
      seedDefaultTaskGroups: vi.fn(),
      createTaskList: vi.fn(async (_userId, _eventId, title) => ({ ...listRecord, title, tasks: [] })),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      findTask: vi.fn(),
    }

    await expect(createTaskListForEvent('user-1', 'event-1', { title: ' Новое ' }, deps)).resolves.toMatchObject({
      title: 'Новое',
      tasks: [],
    })
    expect(deps.createTaskList).toHaveBeenCalledWith('user-1', 'event-1', 'Новое')
  })

  it('creates a task in a list', async () => {
    const deps = {
      listTaskGroups: vi.fn(),
      seedDefaultTaskGroups: vi.fn(),
      createTaskList: vi.fn(),
      createTask: vi.fn(async () => taskRecord),
      updateTask: vi.fn(),
      findTask: vi.fn(),
    }

    await expect(
      createTaskForEvent(
        'user-1',
        'event-1',
        {
          listId: 'list-1',
          title: 'Выбрать ведущего',
          priority: 'high',
          deadline: '28.02.2026',
        },
        deps,
      ),
    ).resolves.toMatchObject({
      id: 'task-1',
      deadline: '28.02.2026',
    })
  })

  it('updates a task and returns the refreshed record', async () => {
    const deps = {
      listTaskGroups: vi.fn(),
      seedDefaultTaskGroups: vi.fn(),
      createTaskList: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(async () => ({ count: 1 })),
      findTask: vi.fn(async () => ({ ...taskRecord, status: 'done' })),
    }

    await expect(updateTaskForEvent('user-1', 'event-1', 'task-1', { status: 'done' }, deps)).resolves.toMatchObject({
      status: 'done',
    })
    expect(deps.updateTask).toHaveBeenCalledWith('user-1', 'event-1', 'task-1', { status: 'done' })
  })
})
