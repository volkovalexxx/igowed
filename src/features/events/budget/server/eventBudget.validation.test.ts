import { describe, expect, it } from 'vitest'
import {
  EventBudgetValidationError,
  parseCreateCategoryInput,
  parseCreateItemInput,
  parseUpdateItemInput,
} from './eventBudget.validation'

describe('parseCreateCategoryInput', () => {
  it('нормализует пробелы в названии', () => {
    expect(parseCreateCategoryInput({ title: '  Шоу   программа ' })).toEqual({ title: 'Шоу программа' })
  })

  it('отклоняет пустое название', () => {
    expect(() => parseCreateCategoryInput({ title: '   ' })).toThrow(EventBudgetValidationError)
  })

  it('отклоняет не-объект', () => {
    expect(() => parseCreateCategoryInput(null)).toThrow(EventBudgetValidationError)
  })
})

describe('parseCreateItemInput', () => {
  it('разбирает корректную статью', () => {
    expect(parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: 5000, paid: 1000, currency: 'BYN' })).toEqual({
      categoryId: 'c1',
      title: 'Кольца',
      cost: 5000,
      paid: 1000,
      currency: 'BYN',
    })
  })

  it('подставляет нули и валюту по умолчанию', () => {
    expect(parseCreateItemInput({ categoryId: 'c1', title: 'Кольца' })).toEqual({
      categoryId: 'c1',
      title: 'Кольца',
      cost: 0,
      paid: 0,
      currency: 'BYN',
    })
  })

  it('требует категорию', () => {
    expect(() => parseCreateItemInput({ title: 'Кольца' })).toThrow('Выберите категорию расходов')
  })

  it('требует название', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: '  ' })).toThrow('Название статьи обязательно')
  })

  it('отклоняет отрицательную стоимость', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: -1 })).toThrow(EventBudgetValidationError)
  })

  it('отклоняет дробные суммы', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: 10.5 })).toThrow(EventBudgetValidationError)
  })

  it('отклоняет оплату больше стоимости', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: 100, paid: 200 })).toThrow(
      'Оплачено не может превышать стоимость',
    )
  })

  it('отклоняет неизвестную валюту', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', currency: 'BTC' })).toThrow(EventBudgetValidationError)
  })
})

describe('parseUpdateItemInput', () => {
  it('принимает частичное обновление', () => {
    expect(parseUpdateItemInput({ paid: 2000 })).toEqual({ paid: 2000 })
  })

  it('не проверяет соотношение сумм в отрыве от сохранённой статьи', () => {
    expect(parseUpdateItemInput({ paid: 999999 })).toEqual({ paid: 999999 })
  })

  it('отклоняет пустой патч', () => {
    expect(() => parseUpdateItemInput({})).toThrow('Нет данных для обновления')
  })

  it('отклоняет пустое название', () => {
    expect(() => parseUpdateItemInput({ title: '  ' })).toThrow(EventBudgetValidationError)
  })
})
