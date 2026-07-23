import { describe, expect, it, vi } from 'vitest'
import {
  createTimelineEntryForEvent,
  isEventTimingError,
  listTimelinesForEvent,
  updateTimelineEntryForEvent,
} from './eventTiming.service'
import { EventTimingValidationError } from './eventTiming.validation'

function entryRecord(overrides = {}) {
  return {
    id: 'e1',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Подготовка',
    location: 'По домам',
    participants: ['Невеста'],
    comment: null,
    order: 0,
    ...overrides,
  }
}

function timelineRecord(overrides = {}) {
  return { id: 't1', title: 'Общий тайминг', order: 0, entries: [entryRecord()], ...overrides }
}

function deps(overrides = {}) {
  return {
    listTimelines: vi.fn().mockResolvedValue([timelineRecord()]),
    seedDefaultTimeline: vi.fn().mockResolvedValue([timelineRecord()]),
    createTimeline: vi.fn().mockResolvedValue(timelineRecord({ entries: [] })),
    createEntry: vi.fn().mockResolvedValue(entryRecord()),
    updateEntry: vi.fn().mockResolvedValue({ count: 1 }),
    findEntry: vi.fn().mockResolvedValue(entryRecord()),
    ...overrides,
  }
}

describe('listTimelinesForEvent', () => {
  it('отдаёт пустой список без пользователя', async () => {
    expect(await listTimelinesForEvent('', 'evt-1', deps())).toEqual([])
  })

  it('не сеет тайминг, если он уже есть', async () => {
    const dependencies = deps()
    await listTimelinesForEvent('u1', 'evt-1', dependencies)

    expect(dependencies.seedDefaultTimeline).not.toHaveBeenCalled()
  })

  it('сеет тайминг по умолчанию при первом открытии', async () => {
    const dependencies = deps({ listTimelines: vi.fn().mockResolvedValue([]) })
    await listTimelinesForEvent('u1', 'evt-1', dependencies)

    expect(dependencies.seedDefaultTimeline).toHaveBeenCalledWith('u1', 'evt-1')
  })

  it('сортирует события по времени начала', async () => {
    const dependencies = deps({
      listTimelines: vi.fn().mockResolvedValue([
        timelineRecord({
          entries: [entryRecord({ id: 'b', startTime: '13:00' }), entryRecord({ id: 'a', startTime: '09:00' })],
        }),
      ]),
    })

    const timelines = await listTimelinesForEvent('u1', 'evt-1', dependencies)

    expect(timelines[0].entries.map((entry) => entry.id)).toEqual(['a', 'b'])
  })
})

describe('createTimelineEntryForEvent', () => {
  it('создаёт событие', async () => {
    const entry = await createTimelineEntryForEvent(
      'u1',
      'evt-1',
      { timelineId: 't1', startTime: '09:00', endTime: '11:00', title: 'Подготовка' },
      deps(),
    )

    expect(entry.id).toBe('e1')
  })

  it('падает на чужом тайминге', async () => {
    const dependencies = deps({ createEntry: vi.fn().mockResolvedValue(null) })

    await expect(
      createTimelineEntryForEvent(
        'u1',
        'evt-1',
        { timelineId: 't9', startTime: '09:00', endTime: '10:00', title: 'Сбор' },
        dependencies,
      ),
    ).rejects.toThrow(EventTimingValidationError)
  })
})

describe('updateTimelineEntryForEvent', () => {
  it('обновляет событие', async () => {
    const dependencies = deps({ findEntry: vi.fn().mockResolvedValue(entryRecord({ title: 'Новое' })) })
    const entry = await updateTimelineEntryForEvent('u1', 'evt-1', 'e1', { title: 'Новое' }, dependencies)

    expect(entry.title).toBe('Новое')
  })

  it('отклоняет окончание раньше сохранённого начала', async () => {
    const dependencies = deps({ findEntry: vi.fn().mockResolvedValue(entryRecord({ startTime: '12:00' })) })

    await expect(updateTimelineEntryForEvent('u1', 'evt-1', 'e1', { endTime: '11:00' }, dependencies)).rejects.toThrow(
      'Окончание не может быть раньше начала',
    )
    expect(dependencies.updateEntry).not.toHaveBeenCalled()
  })

  it('проверяет соотношение по слитому состоянию, а не по патчу', async () => {
    const dependencies = deps({ findEntry: vi.fn().mockResolvedValue(entryRecord({ startTime: '12:00', endTime: '13:00' })) })
    await updateTimelineEntryForEvent('u1', 'evt-1', 'e1', { startTime: '08:00', endTime: '09:00' }, dependencies)

    expect(dependencies.updateEntry).toHaveBeenCalled()
  })

  it('падает на чужом событии', async () => {
    const dependencies = deps({ findEntry: vi.fn().mockResolvedValue(null) })

    await expect(updateTimelineEntryForEvent('u1', 'evt-1', 'e9', { title: 'Х' }, dependencies)).rejects.toThrow(
      EventTimingValidationError,
    )
  })
})

describe('isEventTimingError', () => {
  it('узнаёт ошибку валидации тайминга', () => {
    expect(isEventTimingError(new EventTimingValidationError('нет'))).toBe(true)
  })

  it('не путает её с обычной ошибкой', () => {
    expect(isEventTimingError(new Error('нет'))).toBe(false)
  })
})
