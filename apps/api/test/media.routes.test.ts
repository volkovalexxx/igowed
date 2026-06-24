import { describe, expect, it } from 'vitest'
import { loadEnv } from '../src/config/env.js'
import { buildServer } from '../src/server.js'
import type { MediaStorage } from '../src/modules/media/media.types.js'

const fakeStorage: MediaStorage = {
  getPublicUrl: (objectKey) => `http://localhost:9000/igowed-media/${objectKey}`,
  createUploadUrl: async (objectKey) => `http://minio:9000/igowed-media/${objectKey}?signature=test`,
}

describe('media routes', () => {
  it('creates a presigned upload contract', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
      mediaStorage: fakeStorage,
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
})
