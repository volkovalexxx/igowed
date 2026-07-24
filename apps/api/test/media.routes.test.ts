import { describe, expect, it } from 'vitest'
import { loadEnv } from '../src/config/env.js'
import type { MediaRepository, MediaStorage } from '../src/modules/media/media.types.js'
import { buildServer } from '../src/server.js'

const fakeStorage: MediaStorage = {
  getPublicUrl: (objectKey) => `http://localhost:9000/igowed-media/${objectKey}`,
  createUploadUrl: async (objectKey) => `http://minio:9000/igowed-media/${objectKey}?signature=test`,
  downloadObject: async () => Buffer.alloc(0),
  uploadObject: async () => undefined,
}

const fakeRepository: MediaRepository = {
  createAsset: async (input) => ({
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
  }),
  updateAssetStatus: async (id, status) =>
    id === 'asset-1'
      ? {
          id,
          ownerType: 'event',
          ownerId: 'event-1',
          objectKey: 'event/event-1/original/upload.webp',
          publicUrl: 'http://localhost:9000/igowed-media/event/event-1/original/upload.webp',
          fileName: 'cover.webp',
          contentType: 'image/webp',
          sizeBytes: 2048,
          status,
          createdAt: '2026-06-25T00:00:00.000Z',
        }
      : undefined,
}

describe('media routes', () => {
  it('creates a presigned upload contract and pending media asset metadata', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
      mediaStorage: fakeStorage,
      mediaRepository: fakeRepository,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/media/uploads',
      payload: {
        ownerType: 'event',
        ownerId: 'event-1',
        fileName: 'cover.webp',
        contentType: 'image/webp',
        sizeBytes: 2048,
      },
    })
    const body = response.json()

    expect(response.statusCode).toBe(201)
    expect(body.upload).toMatchObject({
      method: 'PUT',
      headers: { 'Content-Type': 'image/webp' },
      publicUrl: expect.stringContaining('http://localhost:9000/igowed-media/event/event-1/original/'),
      expiresInSeconds: 600,
      maxSizeBytes: 15 * 1024 * 1024,
      asset: {
        id: 'asset-1',
        ownerType: 'event',
        ownerId: 'event-1',
        status: 'PENDING',
      },
    })
    expect(body.upload.uploadUrl).toContain('http://minio:9000/igowed-media/event/event-1/original/')

    await app.close()
  })

  it('rejects unsupported files', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
      mediaStorage: fakeStorage,
      mediaRepository: fakeRepository,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/media/uploads',
      payload: {
        ownerType: 'event',
        ownerId: 'event-1',
        fileName: 'archive.zip',
        contentType: 'application/zip',
        sizeBytes: 2048,
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({ error: 'Некорректные данные файла' })

    await app.close()
  })

  it('returns service unavailable when media storage is not configured', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/media/uploads',
      payload: {
        ownerType: 'event',
        ownerId: 'event-1',
        fileName: 'cover.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 2048,
      },
    })

    expect(response.statusCode).toBe(503)
    expect(response.json()).toEqual({ error: 'Хранилище медиа недоступно' })

    await app.close()
  })

  it('marks uploaded media asset as ready', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
      mediaStorage: fakeStorage,
      mediaRepository: fakeRepository,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/media/assets/asset-1/complete',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      asset: {
        id: 'asset-1',
        ownerType: 'event',
        ownerId: 'event-1',
        status: 'READY',
      },
    })

    await app.close()
  })

  it('returns not found when completed media asset does not exist', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
      mediaStorage: fakeStorage,
      mediaRepository: fakeRepository,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/media/assets/missing/complete',
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({ error: 'Медиа не найдено' })

    await app.close()
  })

  it('returns service unavailable when media metadata repository is not configured', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
      mediaStorage: fakeStorage,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/media/assets/asset-1/complete',
    })

    expect(response.statusCode).toBe(503)
    expect(response.json()).toEqual({ error: 'Медиа-метаданные недоступны' })

    await app.close()
  })
})
