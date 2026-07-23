import { describe, expect, it } from 'vitest'
import { EventReviewValidationError, parseRateVendorInput } from './eventReview.validation'

describe('parseRateVendorInput', () => {
  it('разбирает корректную оценку', () => {
    expect(parseRateVendorInput({ vendorId: 'v1', rating: 4 })).toEqual({ vendorId: 'v1', rating: 4, text: null })
  })

  it('принимает текст отзыва', () => {
    expect(parseRateVendorInput({ vendorId: 'v1', rating: 5, text: '  Отличная   работа ' })).toEqual({
      vendorId: 'v1',
      rating: 5,
      text: 'Отличная работа',
    })
  })

  it('принимает строковую оценку из формы', () => {
    expect(parseRateVendorInput({ vendorId: 'v1', rating: '3' }).rating).toBe(3)
  })

  it('требует подрядчика', () => {
    expect(() => parseRateVendorInput({ rating: 4 })).toThrow('Выберите подрядчика')
  })

  it('отклоняет оценку ниже единицы', () => {
    expect(() => parseRateVendorInput({ vendorId: 'v1', rating: 0 })).toThrow('Оценка должна быть от 1 до 5')
  })

  it('отклоняет оценку выше пяти', () => {
    expect(() => parseRateVendorInput({ vendorId: 'v1', rating: 6 })).toThrow('Оценка должна быть от 1 до 5')
  })

  it('отклоняет дробную оценку', () => {
    expect(() => parseRateVendorInput({ vendorId: 'v1', rating: 4.5 })).toThrow(EventReviewValidationError)
  })

  it('отклоняет не-объект', () => {
    expect(() => parseRateVendorInput(null)).toThrow(EventReviewValidationError)
  })
})
