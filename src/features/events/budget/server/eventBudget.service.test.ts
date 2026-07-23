import { describe, expect, it, vi } from 'vitest'
import {
  createBudgetItemForEvent,
  isEventBudgetError,
  listBudgetCategoriesForEvent,
  updateBudgetItemForEvent,
} from './eventBudget.service'
import { EventBudgetValidationError } from './eventBudget.validation'

function categoryRecord(overrides = {}) {
  return { id: 'c1', title: 'Невеста', order: 0, items: [], ...overrides }
}

function itemRecord(overrides = {}) {
  return { id: 'i1', title: 'Кольца', cost: 5000, paid: 1000, currency: 'BYN', order: 0, ...overrides }
}

function deps(overrides = {}) {
  return {
    listCategories: vi.fn().mockResolvedValue([categoryRecord()]),
    seedDefaultCategories: vi.fn().mockResolvedValue([categoryRecord()]),
    createCategory: vi.fn().mockResolvedValue(categoryRecord()),
    createItem: vi.fn().mockResolvedValue(itemRecord()),
    updateItem: vi.fn().mockResolvedValue({ count: 1 }),
    findItem: vi.fn().mockResolvedValue(itemRecord()),
    ...overrides,
  }
}

describe('listBudgetCategoriesForEvent', () => {
  it('отдаёт пустой список без пользователя', async () => {
    expect(await listBudgetCategoriesForEvent('', 'evt-1', deps())).toEqual([])
  })

  it('не сеет категории, если они уже есть', async () => {
    const dependencies = deps()
    await listBudgetCategoriesForEvent('u1', 'evt-1', dependencies)

    expect(dependencies.seedDefaultCategories).not.toHaveBeenCalled()
  })

  it('сеет категории по умолчанию при первом открытии', async () => {
    const dependencies = deps({ listCategories: vi.fn().mockResolvedValue([]) })
    await listBudgetCategoriesForEvent('u1', 'evt-1', dependencies)

    expect(dependencies.seedDefaultCategories).toHaveBeenCalledWith('u1', 'evt-1')
  })
})

describe('createBudgetItemForEvent', () => {
  it('создаёт статью и отдаёт доменный тип', async () => {
    const item = await createBudgetItemForEvent(
      'u1',
      'evt-1',
      { categoryId: 'c1', title: 'Кольца', cost: 5000, paid: 1000 },
      deps(),
    )

    expect(item.id).toBe('i1')
    expect(item.currency).toBe('BYN')
  })

  it('падает, если категория чужая или не найдена', async () => {
    const dependencies = deps({ createItem: vi.fn().mockResolvedValue(null) })

    await expect(
      createBudgetItemForEvent('u1', 'evt-1', { categoryId: 'c9', title: 'Кольца' }, dependencies),
    ).rejects.toThrow(EventBudgetValidationError)
  })
})

describe('updateBudgetItemForEvent', () => {
  it('обновляет статью и возвращает свежую запись', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(itemRecord({ paid: 2000 })) })
    const item = await updateBudgetItemForEvent('u1', 'evt-1', 'i1', { paid: 2000 }, dependencies)

    expect(item.paid).toBe(2000)
  })

  it('отклоняет оплату больше сохранённой стоимости', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(itemRecord({ cost: 5000 })) })

    await expect(updateBudgetItemForEvent('u1', 'evt-1', 'i1', { paid: 9000 }, dependencies)).rejects.toThrow(
      'Оплачено не может превышать стоимость',
    )
    expect(dependencies.updateItem).not.toHaveBeenCalled()
  })

  it('проверяет соотношение по слитому состоянию, а не по патчу', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(itemRecord({ cost: 5000, paid: 1000 })) })
    await updateBudgetItemForEvent('u1', 'evt-1', 'i1', { cost: 9000, paid: 9000 }, dependencies)

    expect(dependencies.updateItem).toHaveBeenCalled()
  })

  it('падает на чужой статье', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(null) })

    await expect(updateBudgetItemForEvent('u1', 'evt-1', 'i9', { paid: 10 }, dependencies)).rejects.toThrow(
      EventBudgetValidationError,
    )
  })
})

describe('isEventBudgetError', () => {
  it('узнаёт ошибку валидации бюджета', () => {
    expect(isEventBudgetError(new EventBudgetValidationError('нет'))).toBe(true)
  })

  it('не путает её с обычной ошибкой', () => {
    expect(isEventBudgetError(new Error('нет'))).toBe(false)
  })
})
