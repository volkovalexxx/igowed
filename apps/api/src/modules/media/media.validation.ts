import { z } from 'zod'
import type { CreateUploadRequest } from './media.types.js'

export const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024

export class MediaValidationError extends Error {
  statusCode = 400

  constructor(message: string) {
    super(message)
    this.name = 'MediaValidationError'
  }
}

const uploadRequestSchema = z.object({
  ownerType: z.enum(['event', 'vendor', 'blog']),
  ownerId: z.string().trim().min(1).max(120),
  fileName: z.string().trim().min(1).max(180),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  sizeBytes: z.number().int().positive().max(MAX_UPLOAD_SIZE_BYTES),
})

export function parseUploadRequest(raw: unknown): CreateUploadRequest {
  const result = uploadRequestSchema.safeParse(raw)

  if (!result.success) {
    throw new MediaValidationError('Некорректные данные файла')
  }

  return result.data
}
