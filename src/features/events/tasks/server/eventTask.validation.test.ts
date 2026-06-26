import { describe, expect, it } from 'vitest'
import { EventTaskValidationError, parseCreateTaskInput, parseCreateTaskListInput, parseDeadline, parseUpdateTaskInput } from './eventTask.validation'

describe('event task validation', () => {
  it('parses a Russian deadline without timezone drift', () => {
    expect(parseDeadline('28.02.2026')?.toISOString()).toBe('2026-02-28T00:00:00.000Z')
  })

  it('rejects impossible calendar dates', () => {
    expect(() => parseDeadline('29.02.2026')).toThrow(EventTaskValidationError)
  })

  it('normalizes a task list payload', () => {
    expect(parseCreateTaskListInput({ title: '  Список   дел  ' })).toEqual({
      title: 'Список дел',
    })
  })

  it('normalizes a create task payload', () => {
    expect(
      parseCreateTaskInput({
        listId: 'list-1',
        title: '  Выбрать   ведущего ',
        priority: 'high',
        deadline: '28.02.2026',
      }),
    ).toEqual({
      listId: 'list-1',
      title: 'Выбрать ведущего',
      priority: 'high',
      deadline: new Date('2026-02-28T00:00:00.000Z'),
    })
  })

  it('requires at least one update field', () => {
    expect(() => parseUpdateTaskInput({})).toThrow(EventTaskValidationError)
  })
})
