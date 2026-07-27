export class GalleryValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'GalleryValidationError'
  }
}

export type AddPhotoInput = {
  url: string
}

export function parseAddPhotoInput(raw: unknown): AddPhotoInput {
  if (!raw || typeof raw !== 'object') {
    throw new GalleryValidationError('Некорректные данные фото')
  }

  const url = (raw as Record<string, unknown>).url
  if (typeof url !== 'string' || url.trim().length === 0) {
    throw new GalleryValidationError('Не передан адрес фото')
  }

  return { url: url.trim() }
}
