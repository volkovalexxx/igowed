import type { GalleryPhoto } from '../gallery.types'
import { GalleryValidationError, parseAddPhotoInput } from './gallery.validation'

type GalleryDeps = {
  findVendorIdForUser(userId: string): Promise<string | null>
  listByVendor(vendorId: string): Promise<GalleryPhoto[]>
  countByVendor(vendorId: string): Promise<number>
  createPhoto(vendorId: string, url: string, order: number): Promise<GalleryPhoto>
  deleteOwned(vendorId: string, photoId: string): Promise<{ count: number }>
  clearMain(vendorId: string): Promise<void>
  setMain(vendorId: string, photoId: string): Promise<{ count: number }>
}

async function requireVendorId(userId: string, deps: GalleryDeps): Promise<string> {
  const vendorId = await deps.findVendorIdForUser(userId)
  if (!vendorId) {
    throw new GalleryValidationError('Профиль подрядчика не найден')
  }
  return vendorId
}

export async function listPhotos(userId: string, deps: GalleryDeps): Promise<GalleryPhoto[]> {
  if (!userId) return []

  const vendorId = await deps.findVendorIdForUser(userId)
  if (!vendorId) return []

  return deps.listByVendor(vendorId)
}

export async function addPhoto(userId: string, rawInput: unknown, deps: GalleryDeps): Promise<GalleryPhoto> {
  const input = parseAddPhotoInput(rawInput)
  const vendorId = await requireVendorId(userId, deps)

  const order = await deps.countByVendor(vendorId)
  const photo = await deps.createPhoto(vendorId, input.url, order)

  // Первое фото профиля автоматически становится главным (аватаром карточки).
  if (order === 0) {
    await deps.setMain(vendorId, photo.id)
  }

  return photo
}

export async function deletePhoto(userId: string, photoId: string, deps: GalleryDeps): Promise<void> {
  const vendorId = await requireVendorId(userId, deps)

  const result = await deps.deleteOwned(vendorId, photoId)
  if (result.count < 1) {
    throw new GalleryValidationError('Фото не найдено')
  }
}

export async function setMainPhoto(userId: string, photoId: string, deps: GalleryDeps): Promise<void> {
  const vendorId = await requireVendorId(userId, deps)

  await deps.clearMain(vendorId)
  const result = await deps.setMain(vendorId, photoId)
  if (result.count < 1) {
    throw new GalleryValidationError('Фото не найдено')
  }
}

export function isGalleryError(error: unknown): error is GalleryValidationError {
  return error instanceof GalleryValidationError
}
