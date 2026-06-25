import { describe, expect, it, vi } from 'vitest'
import { createEventCoverUploadPayload, EVENT_COVER_MAX_SIZE_BYTES, isAllowedEventCover, uploadEventCover } from './createEventUpload'

function file(name: string, type = 'image/webp') {
  return new File(['cover'], name, { type, lastModified: 1 }) as File & { size: number }
}

describe('event cover upload helpers', () => {
  it('accepts supported image files within size limit', () => {
    expect(isAllowedEventCover({ name: 'cover.webp', type: 'image/webp', size: 1024 })).toBe(true)
    expect(isAllowedEventCover({ name: 'cover.zip', type: 'application/zip', size: 1024 })).toBe(false)
    expect(isAllowedEventCover({ name: 'cover.jpg', type: 'image/jpeg', size: EVENT_COVER_MAX_SIZE_BYTES + 1 })).toBe(false)
  })

  it('creates media API payload for draft event covers', () => {
    expect(createEventCoverUploadPayload({ name: 'cover.avif', type: 'image/avif', size: 2048 })).toEqual({
      ownerType: 'event',
      ownerId: 'draft',
      fileName: 'cover.avif',
      contentType: 'image/avif',
      sizeBytes: 2048,
    })
  })

  it('uploads the file and completes the media asset', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(
          {
            upload: {
              uploadUrl: 'http://minio.local/upload',
              publicUrl: 'http://cdn.local/cover.webp',
              objectKey: 'event/draft/original/cover.webp',
              asset: { id: 'asset-1' },
              method: 'PUT',
              headers: { 'Content-Type': 'image/webp' },
            },
          },
          { status: 201 },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(Response.json({ asset: { id: 'asset-1', status: 'READY' } }))

    await expect(uploadEventCover(file('cover.webp'), fetcher)).resolves.toEqual({
      publicUrl: 'http://cdn.local/cover.webp',
      objectKey: 'event/draft/original/cover.webp',
      assetId: 'asset-1',
    })

    expect(fetcher).toHaveBeenNthCalledWith(3, 'http://localhost:4000/api/v1/media/assets/asset-1/complete', {
      method: 'POST',
    })
  })
})
