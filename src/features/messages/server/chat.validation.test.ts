import { describe, expect, it } from 'vitest'
import { ChatValidationError, MAX_MESSAGE_LENGTH, parseSendMessageInput } from './chat.validation'

describe('parseSendMessageInput', () => {
  it('обрезает крайние пробелы, сохраняя внутренние переводы строк', () => {
    expect(parseSendMessageInput({ text: '  Привет\nкак дела  ' })).toEqual({ text: 'Привет\nкак дела' })
  })

  it('отклоняет пустой текст', () => {
    expect(() => parseSendMessageInput({ text: '   ' })).toThrow('Введите сообщение')
  })

  it('отклоняет слишком длинный текст', () => {
    expect(() => parseSendMessageInput({ text: 'а'.repeat(MAX_MESSAGE_LENGTH + 1) })).toThrow(ChatValidationError)
  })

  it('принимает текст ровно на границе длины', () => {
    const text = 'я'.repeat(MAX_MESSAGE_LENGTH)
    expect(parseSendMessageInput({ text }).text).toHaveLength(MAX_MESSAGE_LENGTH)
  })

  it('отклоняет не-объект', () => {
    expect(() => parseSendMessageInput(null)).toThrow(ChatValidationError)
  })

  it('отклоняет нестроковый текст', () => {
    expect(() => parseSendMessageInput({ text: 42 })).toThrow(ChatValidationError)
  })
})
