export const EVENT_COVER_MAX_SIZE_BYTES = 15 * 1024 * 1024

const allowedCoverTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

type UploadableFile = Pick<File, 'name' | 'size' | 'type'>

type UploadResponse = {
  upload?: {
    uploadUrl: string
    publicUrl: string
    objectKey: string
    asset?: {
      id: string
    }
    method: 'PUT'
    headers: {
      'Content-Type': string
    }
  }
  error?: string
}

type Fetcher = typeof fetch

export function isAllowedEventCover(file: UploadableFile) {
  return allowedCoverTypes.includes(file.type) && file.size > 0 && file.size <= EVENT_COVER_MAX_SIZE_BYTES
}

export function createEventCoverUploadPayload(file: UploadableFile) {
  return {
    ownerType: 'event',
    ownerId: 'draft',
    fileName: file.name,
    contentType: file.type,
    sizeBytes: file.size,
  }
}

export function getMediaApiBase() {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'
}

export async function uploadEventCover(file: File, fetcher: Fetcher = fetch) {
  if (!isAllowedEventCover(file)) {
    throw new Error('Загрузите изображение JPG, PNG, WebP или AVIF до 15 МБ')
  }

  const response = await fetcher(`${getMediaApiBase()}/media/uploads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createEventCoverUploadPayload(file)),
  })
  const result = (await response.json()) as UploadResponse

  if (!response.ok || !result.upload) {
    throw new Error(result.error ?? 'Не удалось подготовить загрузку фото')
  }

  const uploadResponse = await fetcher(result.upload.uploadUrl, {
    method: result.upload.method,
    headers: result.upload.headers,
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error('Не удалось загрузить фото')
  }

  if (result.upload.asset?.id) {
    const completeResponse = await fetcher(`${getMediaApiBase()}/media/assets/${result.upload.asset.id}/complete`, {
      method: 'POST',
    })

    if (!completeResponse.ok) {
      throw new Error('Не удалось завершить загрузку фото')
    }
  }

  return {
    publicUrl: result.upload.publicUrl,
    objectKey: result.upload.objectKey,
    assetId: result.upload.asset?.id,
  }
}
