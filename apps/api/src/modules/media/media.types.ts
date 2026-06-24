export type MediaOwnerType = 'event' | 'vendor' | 'blog'

export type CreateUploadRequest = {
  ownerType: MediaOwnerType
  ownerId: string
  fileName: string
  contentType: string
  sizeBytes: number
}

export type CreateUploadInput = CreateUploadRequest & {
  requestId: string
}

export type MediaStorage = {
  getPublicUrl(objectKey: string): string
  createUploadUrl(objectKey: string, expiresInSeconds: number): Promise<string>
}

export type PresignedUpload = {
  uploadUrl: string
  publicUrl: string
  objectKey: string
  method: 'PUT'
  headers: {
    'Content-Type': string
  }
  expiresInSeconds: number
  maxSizeBytes: number
}
