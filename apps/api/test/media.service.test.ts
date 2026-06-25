import { describe, expect, it, vi } from 'vitest'
import { createMediaObjectKey, createPresignedUpload, UPLOAD_URL_TTL_SECONDS } from '../src/modules/media/media.service.js'
import type { MediaRepository, MediaStorage } from '../src/modules/media/media.types.js'

describe('media service', () => {
  it('creates stable object keys by owner and request id', () => {
    expect(
      createMediaObjectKey({
        ownerType: 'event',
        ownerId: 'Event 123',
        requestId: 'Upload 456',
        fileName: 'cover.png',
        contentType: 'image/png',
        sizeBytes: 1024,
      }),
    ).toBe('event/event-123/original/upload-456.png')
  })

  it('returns presigned upload contract', async () => {
    const storage: MediaStorage = {
      getPublicUrl: (objectKey) => `https://cdn.example.com/${objectKey}`,
      createUploadUrl: vi.fn(async (objectKey) => `https://storage.example.com/${objectKey}?signature=test`),
    }
    const repository: MediaRepository = {
      createAsset: vi.fn(async (input) => ({
        id: 'asset-1',
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        objectKey: input.objectKey,
        publicUrl: input.publicUrl,
        fileName: input.fileName,
        contentType: input.contentType,
        sizeBytes: input.sizeBytes,
        status: input.status,
        createdAt: '2026-06-25T00:00:00.000Z',
      })),
      updateAssetStatus: vi.fn(),
    }

    const result = await createPresignedUpload(
      {
        ownerType: 'event',
        ownerId: 'event-1',
        fileName: 'cover.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
      },
      storage,
      repository,
    )

    expect(result.method).toBe('PUT')
    expect(result.headers).toEqual({ 'Content-Type': 'image/jpeg' })
    expect(result.expiresInSeconds).toBe(UPLOAD_URL_TTL_SECONDS)
    expect(result.maxSizeBytes).toBe(15 * 1024 * 1024)
    expect(result.objectKey).toMatch(/^event\/event-1\/original\/[a-z0-9-]+\.jpg$/)
    expect(result.publicUrl).toBe(`https://cdn.example.com/${result.objectKey}`)
    expect(result.asset).toMatchObject({
      id: 'asset-1',
      ownerType: 'event',
      ownerId: 'event-1',
      objectKey: result.objectKey,
      publicUrl: result.publicUrl,
      status: 'PENDING',
    })
    expect(storage.createUploadUrl).toHaveBeenCalledWith(result.objectKey, UPLOAD_URL_TTL_SECONDS)
    expect(repository.createAsset).toHaveBeenCalledWith({
      ownerType: 'event',
      ownerId: 'event-1',
      fileName: 'cover.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1024,
      objectKey: result.objectKey,
      publicUrl: result.publicUrl,
      status: 'PENDING',
    })
  })
})
