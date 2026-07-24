import { describe, expect, it } from 'vitest'
import { planVariantWidths, variantObjectKey } from '../src/modules/media/media.processor.js'

describe('planVariantWidths', () => {
  it('отдаёт все стандартные ширины для крупного оригинала', () => {
    expect(planVariantWidths(4000)).toEqual([320, 640, 960, 1280, 1920])
  })

  it('не апскейлит: отбрасывает ширины больше оригинала', () => {
    expect(planVariantWidths(1000)).toEqual([320, 640, 960])
  })

  it('добавляет ширину оригинала, если он меньше самой мелкой ступени', () => {
    expect(planVariantWidths(200)).toEqual([200])
  })

  it('не дублирует ступень, совпавшую с оригиналом', () => {
    expect(planVariantWidths(640)).toEqual([320, 640])
  })

  it('на некорректной ширине отдаёт пустой план', () => {
    expect(planVariantWidths(0)).toEqual([])
    expect(planVariantWidths(-10)).toEqual([])
  })
})

describe('variantObjectKey', () => {
  it('заменяет сегмент original на ширину и меняет расширение на webp', () => {
    expect(variantObjectKey('vendor/v1/original/abc.jpg', 640)).toBe('vendor/v1/w640/abc.webp')
  })

  it('работает для png-оригинала', () => {
    expect(variantObjectKey('event/e1/original/cover.png', 1280)).toBe('event/e1/w1280/cover.webp')
  })

  it('оставляет ключ без сегмента original как есть по имени, подставляя ширину папкой', () => {
    expect(variantObjectKey('blog/b1/photo.jpeg', 320)).toBe('blog/b1/w320/photo.webp')
  })
})
