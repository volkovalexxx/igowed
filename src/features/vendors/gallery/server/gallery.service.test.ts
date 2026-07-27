import { describe, expect, it, vi } from 'vitest'
import { addPhoto, deletePhoto, isGalleryError, listPhotos, setMainPhoto } from './gallery.service'
import { GalleryValidationError } from './gallery.validation'

function photo(overrides = {}) {
  return { id: 'p1', url: 'a.jpg', thumb: null, order: 0, isAvatar: false, ...overrides }
}

function deps(overrides = {}) {
  return {
    findVendorIdForUser: vi.fn().mockResolvedValue('v1'),
    listByVendor: vi.fn().mockResolvedValue([photo()]),
    countByVendor: vi.fn().mockResolvedValue(1),
    createPhoto: vi.fn().mockResolvedValue(photo({ id: 'new' })),
    deleteOwned: vi.fn().mockResolvedValue({ count: 1 }),
    clearMain: vi.fn().mockResolvedValue(undefined),
    setMain: vi.fn().mockResolvedValue({ count: 1 }),
    ...overrides,
  }
}

describe('listPhotos', () => {
  it('без пользователя отдаёт пустой список', async () => {
    expect(await listPhotos('', deps())).toEqual([])
  })

  it('отдаёт фото своего профиля', async () => {
    const photos = await listPhotos('u1', deps())
    expect(photos[0].id).toBe('p1')
  })

  it('без профиля подрядчика отдаёт пустой список', async () => {
    expect(await listPhotos('u1', deps({ findVendorIdForUser: vi.fn().mockResolvedValue(null) }))).toEqual([])
  })
})

describe('addPhoto', () => {
  it('создаёт фото в конце и отдаёт его', async () => {
    const dependencies = deps({ countByVendor: vi.fn().mockResolvedValue(3) })
    const created = await addPhoto('u1', { url: 'new.jpg' }, dependencies)

    expect(created.id).toBe('new')
    expect(dependencies.createPhoto).toHaveBeenCalledWith('v1', 'new.jpg', 3)
  })

  it('первое фото профиля становится главным автоматически', async () => {
    const dependencies = deps({ countByVendor: vi.fn().mockResolvedValue(0) })
    await addPhoto('u1', { url: 'first.jpg' }, dependencies)

    expect(dependencies.setMain).toHaveBeenCalled()
  })

  it('отклоняет пустой url', async () => {
    await expect(addPhoto('u1', { url: '  ' }, deps())).rejects.toThrow(GalleryValidationError)
  })

  it('падает без профиля подрядчика', async () => {
    const dependencies = deps({ findVendorIdForUser: vi.fn().mockResolvedValue(null) })
    await expect(addPhoto('u1', { url: 'x.jpg' }, dependencies)).rejects.toThrow('Профиль подрядчика не найден')
  })
})

describe('deletePhoto', () => {
  it('удаляет своё фото', async () => {
    const dependencies = deps()
    await deletePhoto('u1', 'p1', dependencies)
    expect(dependencies.deleteOwned).toHaveBeenCalledWith('v1', 'p1')
  })

  it('падает, если фото не найдено или чужое', async () => {
    const dependencies = deps({ deleteOwned: vi.fn().mockResolvedValue({ count: 0 }) })
    await expect(deletePhoto('u1', 'p9', dependencies)).rejects.toThrow(GalleryValidationError)
  })
})

describe('setMainPhoto', () => {
  it('снимает старое главное и ставит новое', async () => {
    const dependencies = deps()
    await setMainPhoto('u1', 'p1', dependencies)

    expect(dependencies.clearMain).toHaveBeenCalledWith('v1')
    expect(dependencies.setMain).toHaveBeenCalledWith('v1', 'p1')
  })

  it('падает, если фото чужое', async () => {
    const dependencies = deps({ setMain: vi.fn().mockResolvedValue({ count: 0 }) })
    await expect(setMainPhoto('u1', 'p9', dependencies)).rejects.toThrow(GalleryValidationError)
  })
})

describe('isGalleryError', () => {
  it('узнаёт ошибку валидации', () => {
    expect(isGalleryError(new GalleryValidationError('нет'))).toBe(true)
  })

  it('не путает с обычной ошибкой', () => {
    expect(isGalleryError(new Error('нет'))).toBe(false)
  })
})
