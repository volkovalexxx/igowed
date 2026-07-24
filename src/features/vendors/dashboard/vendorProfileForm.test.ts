import { describe, expect, it } from 'vitest'
import { formatWorkingHours, mapProfileFormToPatch, mapVendorToProfileForm, parseWorkingHours } from './vendorProfileForm'
import type { ProfileFormData, VendorProfileRecord } from './vendorProfileForm.types'

function record(overrides: Partial<VendorProfileRecord> = {}): VendorProfileRecord {
  return {
    id: 'v1',
    firstName: 'Анна',
    lastName: 'Смирнова',
    username: 'anna_photo',
    bio: 'Свадебный фотограф',
    country: 'Беларусь',
    cities: ['Минск', 'Гродно'],
    phone: '+375291112233',
    phone2: null,
    website: 'anna.by',
    instagram: '@anna',
    address: 'ул. Ленина 1',
    businessType: 'IP',
    bankDetails: 'ИП Смирнова',
    workingHours: 'с 10:00 до 20:00',
    languages: ['Русский'],
    galleryDisplay: 'VERTICAL',
    cardDisplay: 'SQUARE',
    specializations: ['Свадьба', 'Юбилей'],
    ...overrides,
  }
}

describe('parseWorkingHours', () => {
  it('разбирает «с X до Y»', () => {
    expect(parseWorkingHours('с 10:00 до 20:00')).toEqual({ from: '10:00', to: '20:00' })
  })

  it('на пустом значении даёт пустые границы', () => {
    expect(parseWorkingHours(null)).toEqual({ from: '', to: '' })
  })

  it('терпит произвольный текст без падения', () => {
    expect(parseWorkingHours('по договорённости')).toEqual({ from: '', to: '' })
  })
})

describe('formatWorkingHours', () => {
  it('склеивает границы в «с X до Y»', () => {
    expect(formatWorkingHours('10:00', '20:00')).toBe('с 10:00 до 20:00')
  })

  it('без обеих границ даёт пустую строку', () => {
    expect(formatWorkingHours('', '')).toBe('')
  })
})

describe('mapVendorToProfileForm', () => {
  it('раскладывает запись в поля формы', () => {
    const form = mapVendorToProfileForm(record())

    expect(form.firstName).toBe('Анна')
    expect(form.login).toBe('anna_photo')
    expect(form.descriptionPhotographer).toBe('Свадебный фотограф')
    expect(form.displayMode).toBe('VERTICAL')
    expect(form.cardMode).toBe('SQUARE')
    expect(form.specializations).toEqual(['Свадьба', 'Юбилей'])
    expect(form.workFrom).toBe('10:00')
    expect(form.workTo).toBe('20:00')
    expect(form.activityType).toBe('IP')
  })

  it('подставляет дефолты для пустых полей', () => {
    const form = mapVendorToProfileForm(record({ bio: null, phone2: null, businessType: null }))

    expect(form.descriptionPhotographer).toBe('')
    expect(form.phone2).toBe('')
    expect(form.activityType).toBe('INDIVIDUAL')
  })
})

describe('mapProfileFormToPatch', () => {
  function form(overrides: Partial<ProfileFormData> = {}): ProfileFormData {
    return { ...mapVendorToProfileForm(record()), ...overrides }
  }

  it('собирает PATCH-тело из полей формы', () => {
    const patch = mapProfileFormToPatch(form({ firstName: 'Мария', login: 'maria' }))

    expect(patch.firstName).toBe('Мария')
    expect(patch.username).toBe('maria')
    expect(patch.bio).toBe('Свадебный фотограф')
    expect(patch.galleryDisplay).toBe('VERTICAL')
    expect(patch.cardDisplay).toBe('SQUARE')
  })

  it('формирует workingHours из границ', () => {
    const patch = mapProfileFormToPatch(form({ workFrom: '09:00', workTo: '18:00' }))

    expect(patch.workingHours).toBe('с 09:00 до 18:00')
  })

  it('прокидывает специализации массивом', () => {
    const patch = mapProfileFormToPatch(form({ specializations: ['Свадьба'] }))

    expect(patch.specializations).toEqual(['Свадьба'])
  })
})
