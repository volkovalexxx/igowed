import { describe, expect, it } from 'vitest'
import { createEventCoverUploadPayload, EVENT_COVER_MAX_SIZE_BYTES, isAllowedEventCover } from './createEventUpload'

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
})
