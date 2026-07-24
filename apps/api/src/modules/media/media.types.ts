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
  downloadObject(objectKey: string): Promise<Buffer>
  uploadObject(objectKey: string, body: Buffer, contentType: string): Promise<void>
}

export type MediaVariant = {
  width: number
  objectKey: string
  url: string
}

export type ProcessedMedia = {
  width: number
  height: number
  blurDataUrl: string
  variants: MediaVariant[]
}

export type MediaVariantsRepository = {
  markProcessed(id: string, processed: ProcessedMedia): Promise<void>
  markFailed(id: string): Promise<void>
  findObjectKey(id: string): Promise<{ objectKey: string; contentType: string } | undefined>
}

export type VariantsJobData = {
  assetId: string
  objectKey: string
  contentType: string
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
