import { describe, expect, it } from 'vitest'
import {
  EventTimingValidationError,
  parseCreateEntryInput,
  parseCreateTimelineInput,
  parseTimeInput,
  parseUpdateEntryInput,
} from './eventTiming.validation'

describe('parseTimeInput', () => {
  it('нормализует односимвольный час', () => {
    expect(parseTimeInput('9:05')).toBe('09:05')
  })

  it('принимает нормальное время', () => {
    expect(parseTimeInput('14:30')).toBe('14:30')
  })

  it('отклоняет час больше 23', () => {
    expect(() => parseTimeInput('24:00')).toThrow(EventTimingValidationError)
  })

  it('отклоняет минуты больше 59', () => {
    expect(() => parseTimeInput('12:60')).toThrow(EventTimingValidationError)
  })

  it('отклоняет мусор', () => {
    expect(() => parseTimeInput('вечером')).toThrow('Укажите время в формате ЧЧ:ММ')
  })
})

describe('parseCreateTimelineInput', () => {
  it('нормализует название', () => {
    expect(parseCreateTimelineInput({ title: '  Общий   тайминг ' })).toEqual({ title: 'Общий тайминг' })
  })

  it('отклоняет пустое название', () => {
    expect(() => parseCreateTimelineInput({ title: '' })).toThrow(EventTimingValidationError)
  })
})

describe('parseCreateEntryInput', () => {
  it('разбирает корректное событие', () => {
    expect(
      parseCreateEntryInput({
        timelineId: 't1',
        startTime: '9:00',
        endTime: '11:00',
        title: 'Подготовка',
        location: 'По домам',
        participants: ['Невеста', 'Фотограф'],
        comment: 'Не опаздывать',
      }),
    ).toEqual({
      timelineId: 't1',
      startTime: '09:00',
      endTime: '11:00',
      title: 'Подготовка',
      location: 'По домам',
      participants: ['Невеста', 'Фотограф'],
      comment: 'Не опаздывать',
    })
  })

  it('обнуляет необязательные поля', () => {
    const parsed = parseCreateEntryInput({ timelineId: 't1', startTime: '09:00', endTime: '10:00', title: 'Сбор' })

    expect(parsed.location).toBeNull()
    expect(parsed.comment).toBeNull()
    expect(parsed.participants).toEqual([])
  })

  it('требует тайминг', () => {
    expect(() => parseCreateEntryInput({ startTime: '09:00', endTime: '10:00', title: 'Сбор' })).toThrow('Выберите тайминг')
  })

  it('требует название', () => {
    expect(() => parseCreateEntryInput({ timelineId: 't1', startTime: '09:00', endTime: '10:00', title: ' ' })).toThrow(
      'Название события обязательно',
    )
  })

  it('отклоняет окончание раньше начала', () => {
    expect(() => parseCreateEntryInput({ timelineId: 't1', startTime: '12:00', endTime: '11:00', title: 'Сбор' })).toThrow(
      'Окончание не может быть раньше начала',
    )
  })

  it('допускает событие нулевой длины', () => {
    expect(parseCreateEntryInput({ timelineId: 't1', startTime: '12:00', endTime: '12:00', title: 'Тост' }).endTime).toBe('12:00')
  })

  it('отклоняет участника вне словаря ролей', () => {
    expect(() =>
      parseCreateEntryInput({ timelineId: 't1', startTime: '09:00', endTime: '10:00', title: 'Сбор', participants: ['Сосед'] }),
    ).toThrow(EventTimingValidationError)
  })

  it('убирает дубли участников', () => {
    const parsed = parseCreateEntryInput({
      timelineId: 't1',
      startTime: '09:00',
      endTime: '10:00',
      title: 'Сбор',
      participants: ['Невеста', 'Невеста'],
    })

    expect(parsed.participants).toEqual(['Невеста'])
  })
})

describe('parseUpdateEntryInput', () => {
  it('принимает частичное обновление', () => {
    expect(parseUpdateEntryInput({ title: 'Новое название' })).toEqual({ title: 'Новое название' })
  })

  it('нормализует время в патче', () => {
    expect(parseUpdateEntryInput({ startTime: '9:00' })).toEqual({ startTime: '09:00' })
  })

  it('позволяет очистить комментарий', () => {
    expect(parseUpdateEntryInput({ comment: '' })).toEqual({ comment: null })
  })

  it('не проверяет соотношение времён в отрыве от сохранённого события', () => {
    expect(parseUpdateEntryInput({ endTime: '01:00' })).toEqual({ endTime: '01:00' })
  })

  it('отклоняет пустой патч', () => {
    expect(() => parseUpdateEntryInput({})).toThrow('Нет данных для обновления')
  })
})
