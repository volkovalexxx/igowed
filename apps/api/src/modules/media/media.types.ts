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

export type MediaAssetRecord = {
  id: string
  ownerType: MediaOwnerType
  ownerId: string
  objectKey: string
  publicUrl: string
  fileName: string
  contentType: string
  sizeBytes: number
  status: 'PENDING' | 'READY' | 'FAILED'
  createdAt: string
}

export type CreateMediaAssetInput = CreateUploadRequest & {
  objectKey: string
  publicUrl: string
  status: MediaAssetRecord['status']
}

export type MediaRepository = {
  createAsset(input: CreateMediaAssetInput): Promise<MediaAssetRecord>
  updateAssetStatus(id: string, status: MediaAssetRecord['status']): Promise<MediaAssetRecord | undefined>
}

export type PresignedUpload = {
  uploadUrl: string
  publicUrl: string
  objectKey: string
  asset?: MediaAssetRecord
  method: 'PUT'
  headers: {
    'Content-Type': string
  }
  expiresInSeconds: number
  maxSizeBytes: number
}
