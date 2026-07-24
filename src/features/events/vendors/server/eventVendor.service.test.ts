import { describe, expect, it, vi } from 'vitest'
import { addVendorToEvent, isEventVendorError, listEventVendorSlots, removeVendorFromEvent } from './eventVendor.service'
import { EventVendorValidationError } from './eventVendor.validation'

function vendorRecord(overrides = {}) {
  return {
    id: 'ev1',
    role: 'Фотограф',
    vendor: {
      id: 'v1',
      slug: 'loginov',
      username: 'loginov_pho',
      firstName: 'Дмитрий',
      lastName: 'Логинов',
      avatar: null,
      isPro: true,
      rating: 4,
    },
    ...overrides,
  }
}

function deps(overrides = {}) {
  return {
    listEventVendors: vi.fn().mockResolvedValue([vendorRecord()]),
    findVendor: vi.fn().mockResolvedValue({ id: 'v1' }),
    addEventVendor: vi.fn().mockResolvedValue(vendorRecord()),
    removeEventVendor: vi.fn().mockResolvedValue({ count: 1 }),
    ...overrides,
  }
}

describe('listEventVendorSlots', () => {
  it('отдаёт пустые слоты без пользователя', async () => {
    const slots = await listEventVendorSlots('', 'evt-1', deps())

    expect(slots.every((slot) => slot.isEmpty)).toBe(true)
  })

  it('раскладывает привязанных подрядчиков по слотам', async () => {
    const slots = await listEventVendorSlots('u1', 'evt-1', deps())

    expect(slots.find((slot) => slot.role === 'Фотограф')?.vendors[0]?.name).toBe('Дмитрий Логинов')
  })
})

describe('addVendorToEvent', () => {
  it('привязывает подрядчика и отдаёт карточку', async () => {
    const entry = await addVendorToEvent('u1', 'evt-1', { vendorId: 'v1', role: 'Фотограф' }, deps())

    expect(entry.vendorId).toBe('v1')
    expect(entry.role).toBe('Фотограф')
  })

  it('падает, если подрядчик не существует', async () => {
    const dependencies = deps({ findVendor: vi.fn().mockResolvedValue(null) })

    await expect(addVendorToEvent('u1', 'evt-1', { vendorId: 'v9', role: 'Фотограф' }, dependencies)).rejects.toThrow(
      'Подрядчик не найден',
    )
    expect(dependencies.addEventVendor).not.toHaveBeenCalled()
  })

  it('падает, если чужое мероприятие или подрядчик уже привязан', async () => {
    const dependencies = deps({ addEventVendor: vi.fn().mockResolvedValue(null) })

    await expect(addVendorToEvent('u1', 'evt-1', { vendorId: 'v1', role: 'Фотограф' }, dependencies)).rejects.toThrow(
      EventVendorValidationError,
    )
  })

  it('отклоняет некорректную роль до похода в базу', async () => {
    const dependencies = deps()

    await expect(addVendorToEvent('u1', 'evt-1', { vendorId: 'v1', role: 'Космонавт' }, dependencies)).rejects.toThrow(
      'Выберите роль из списка',
    )
    expect(dependencies.findVendor).not.toHaveBeenCalled()
  })
})

describe('removeVendorFromEvent', () => {
  it('отвязывает подрядчика', async () => {
    const dependencies = deps()
    await removeVendorFromEvent('u1', 'evt-1', 'v1', dependencies)

    expect(dependencies.removeEventVendor).toHaveBeenCalledWith('u1', 'evt-1', 'v1')
  })

  it('падает, если связи не было', async () => {
    const dependencies = deps({ removeEventVendor: vi.fn().mockResolvedValue({ count: 0 }) })

    await expect(removeVendorFromEvent('u1', 'evt-1', 'v9', dependencies)).rejects.toThrow(EventVendorValidationError)
  })
})

describe('isEventVendorError', () => {
  it('узнаёт ошибку валидации', () => {
    expect(isEventVendorError(new EventVendorValidationError('нет'))).toBe(true)
  })

  it('не путает её с обычной ошибкой', () => {
    expect(isEventVendorError(new Error('нет'))).toBe(false)
  })
})
