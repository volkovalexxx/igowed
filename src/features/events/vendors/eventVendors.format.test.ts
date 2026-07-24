import { describe, expect, it } from 'vitest'
import { VENDOR_SLOT_ROLES } from './eventVendors.data'
import { buildVendorSlots, isVendorRole } from './eventVendors.format'
import type { EventVendorEntry } from './eventVendors.types'

function entry(overrides: Partial<EventVendorEntry> = {}): EventVendorEntry {
  return {
    id: 'ev1',
    vendorId: 'v1',
    slug: 'loginov',
    username: 'loginov_pho',
    name: 'Дмитрий Логинов',
    role: 'Фотограф',
    avatar: null,
    isPro: true,
    rating: 4,
    ...overrides,
  }
}

describe('buildVendorSlots', () => {
  it('создаёт слот на каждую роль из словаря', () => {
    const slots = buildVendorSlots([])

    expect(slots).toHaveLength(VENDOR_SLOT_ROLES.length)
    expect(slots.map((slot) => slot.role)).toEqual([...VENDOR_SLOT_ROLES])
  })

  it('раскладывает подрядчиков по их ролям', () => {
    const slots = buildVendorSlots([entry({ role: 'Фотограф' }), entry({ id: 'ev2', vendorId: 'v2', role: 'Ведущий' })])

    expect(slots.find((slot) => slot.role === 'Фотограф')?.vendors).toHaveLength(1)
    expect(slots.find((slot) => slot.role === 'Ведущий')?.vendors).toHaveLength(1)
    expect(slots.find((slot) => slot.role === 'Декоратор')?.vendors).toEqual([])
  })

  it('собирает несколько подрядчиков одной роли в один слот', () => {
    const slots = buildVendorSlots([
      entry({ id: 'ev1', vendorId: 'v1', role: 'Видеограф' }),
      entry({ id: 'ev2', vendorId: 'v2', role: 'Видеограф' }),
    ])

    expect(slots.find((slot) => slot.role === 'Видеограф')?.vendors).toHaveLength(2)
  })

  it('добавляет слот для нестандартной роли в конец', () => {
    const slots = buildVendorSlots([entry({ role: 'Фейерверк' })])

    expect(slots.at(-1)?.role).toBe('Фейерверк')
    expect(slots.at(-1)?.vendors).toHaveLength(1)
  })

  it('помечает слот пустым только без подрядчиков', () => {
    const slots = buildVendorSlots([entry({ role: 'Фотограф' })])

    expect(slots.find((slot) => slot.role === 'Фотограф')?.isEmpty).toBe(false)
    expect(slots.find((slot) => slot.role === 'Декоратор')?.isEmpty).toBe(true)
  })
})

describe('isVendorRole', () => {
  it('узнаёт роль из словаря', () => {
    expect(isVendorRole('Фотограф')).toBe(true)
  })

  it('отклоняет мусор', () => {
    expect(isVendorRole('Космонавт')).toBe(false)
  })
})
