export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export type UploadOwner = {
  ownerType: 'vendor' | 'event' | 'blog'
  ownerId: string
}

export type PresignRequest = UploadOwner & {
  fileName: string
  contentType: string
  sizeBytes: number
}

export type PresignResponse = {
  upload: {
    uploadUrl: string
    publicUrl: string
    objectKey: string
    asset?: { id: string }
    headers: Record<string, string>
  }
}

export type UploadResult = {
  publicUrl: string
  objectKey: string
  assetId: string | null
}

export type UploadDeps = {
  requestPresign(request: PresignRequest): Promise<PresignResponse>
  putObject(url: string, body: File, headers: Record<string, string>): Promise<void>
  completeAsset(assetId: string): Promise<void>
}

/**
 * Оркестрация загрузки изображения: presign → прямой PUT в хранилище → complete.
 * Пометка complete запускает фоновую генерацию вариантов; аватар доступен сразу по publicUrl.
 */
export async function uploadImage(file: File, owner: UploadOwner, deps: UploadDeps): Promise<UploadResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Только изображения (JPG, PNG, WebP)')
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Файл не больше 10 МБ')
  }

  const { upload } = await deps.requestPresign({
    ownerType: owner.ownerType,
    ownerId: owner.ownerId,
    fileName: file.name,
    contentType: file.type,
    sizeBytes: file.size,
  })

  await deps.putObject(upload.uploadUrl, file, upload.headers)

  if (upload.asset) {
    await deps.completeAsset(upload.asset.id)
  }

  return { publicUrl: upload.publicUrl, objectKey: upload.objectKey, assetId: upload.asset?.id ?? null }
}
