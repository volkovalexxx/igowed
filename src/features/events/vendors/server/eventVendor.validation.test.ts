import { describe, expect, it } from 'vitest'
import { EventVendorValidationError, parseAddVendorInput } from './eventVendor.validation'

describe('parseAddVendorInput', () => {
  it('разбирает корректный ввод', () => {
    expect(parseAddVendorInput({ vendorId: 'v1', role: 'Фотограф' })).toEqual({ vendorId: 'v1', role: 'Фотограф' })
  })

  it('нормализует пробелы в роли', () => {
    expect(parseAddVendorInput({ vendorId: 'v1', role: '  Женский   образ ' })).toEqual({
      vendorId: 'v1',
      role: 'Женский образ',
    })
  })

  it('требует подрядчика', () => {
    expect(() => parseAddVendorInput({ role: 'Фотограф' })).toThrow('Выберите подрядчика')
  })

  it('требует роль из словаря', () => {
    expect(() => parseAddVendorInput({ vendorId: 'v1', role: 'Космонавт' })).toThrow('Выберите роль из списка')
  })

  it('отклоняет пустую роль', () => {
    expect(() => parseAddVendorInput({ vendorId: 'v1', role: '  ' })).toThrow(EventVendorValidationError)
  })

  it('отклоняет не-объект', () => {
    expect(() => parseAddVendorInput(null)).toThrow(EventVendorValidationError)
  })
})
