import { describe, expect, it, vi } from 'vitest'
import { loadVendorBoard } from './vendorBoard.service'
import type { BoardVendor } from '../vendorBoard.types'

function boardVendor(id: string): BoardVendor {
  return {
    id,
    userId: `user-${id}`,
    slug: id,
    username: id,
    firstName: 'Имя',
    lastName: 'Фамилия',
    avatar: null,
    isPro: false,
    rating: 4,
    pricePerHour: 5000,
    photoUrl: null,
    categoryName: 'Фотограф',
  }
}

function deps(overrides = {}) {
  return {
    listFavorites: vi.fn().mockResolvedValue([boardVendor('fav')]),
    listShortlist: vi.fn().mockResolvedValue([boardVendor('short')]),
    listPopular: vi.fn().mockResolvedValue([boardVendor('pop')]),
    ...overrides,
  }
}

describe('loadVendorBoard', () => {
  it('отдаёт пустую доску без пользователя', async () => {
    const board = await loadVendorBoard('', 'favorites', deps())

    expect(board.vendors).toEqual([])
    expect(board.recommended).toEqual([])
  })

  it('берёт избранное для доски избранного', async () => {
    const dependencies = deps()
    const board = await loadVendorBoard('u1', 'favorites', dependencies)

    expect(board.vendors.map((v) => v.id)).toEqual(['fav'])
    expect(dependencies.listShortlist).not.toHaveBeenCalled()
  })

  it('берёт шорт-лист для доски шорт-листа', async () => {
    const dependencies = deps()
    const board = await loadVendorBoard('u1', 'shortlist', dependencies)

    expect(board.vendors.map((v) => v.id)).toEqual(['short'])
    expect(dependencies.listFavorites).not.toHaveBeenCalled()
  })

  it('подставляет популярных, когда список пуст', async () => {
    const dependencies = deps({ listFavorites: vi.fn().mockResolvedValue([]) })
    const board = await loadVendorBoard('u1', 'favorites', dependencies)

    expect(board.vendors.map((v) => v.id)).toEqual(['pop'])
    expect(board.isFallback).toBe(true)
  })

  it('не помечает непустой список как подстановку', async () => {
    const board = await loadVendorBoard('u1', 'favorites', deps())

    expect(board.isFallback).toBe(false)
  })

  it('всегда отдаёт блок рекомендаций', async () => {
    const board = await loadVendorBoard('u1', 'shortlist', deps())

    expect(board.recommended.map((v) => v.id)).toEqual(['pop'])
  })
})
