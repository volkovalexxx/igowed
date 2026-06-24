import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { MAX_UPLOAD_SIZE_BYTES, parseUploadRequest } from './media.validation.js'
import type { CreateUploadInput, CreateUploadRequest, MediaStorage, PresignedUpload } from './media.types.js'

export const UPLOAD_URL_TTL_SECONDS = 10 * 60

const extensionByContentType: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function slugPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function extensionFromFile(input: CreateUploadRequest) {
  const declared = extensionByContentType[input.contentType]
  if (declared) return declared

  const ext = extname(input.fileName).replace('.', '').toLowerCase()
  return ext || 'bin'
}

export function createMediaObjectKey(input: CreateUploadInput) {
  const ownerType = slugPart(input.ownerType)
  const ownerId = slugPart(input.ownerId) || 'unknown'
  const requestId = slugPart(input.requestId) || randomUUID()
  const extension = extensionFromFile(input)

  return `${ownerType}/${ownerId}/original/${requestId}.${extension}`
}

export async function createPresignedUpload(raw: unknown, storage: MediaStorage): Promise<PresignedUpload> {
  const input = parseUploadRequest(raw)
  const objectKey = createMediaObjectKey({
    ...input,
    requestId: randomUUID(),
  })
  const uploadUrl = await storage.createUploadUrl(objectKey, UPLOAD_URL_TTL_SECONDS)

  return {
    uploadUrl,
    publicUrl: storage.getPublicUrl(objectKey),
    objectKey,
    method: 'PUT',
    headers: {
      'Content-Type': input.contentType,
    },
    expiresInSeconds: UPLOAD_URL_TTL_SECONDS,
    maxSizeBytes: MAX_UPLOAD_SIZE_BYTES,
  }
}
