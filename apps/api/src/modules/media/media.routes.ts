import type { FastifyInstance } from 'fastify'
import type { ApiEnv } from '../../config/env.js'
import { createMediaRepository } from './media.repository.js'
import { createPresignedUpload } from './media.service.js'
import { createMediaStorage } from './media.storage.js'
import type { MediaRepository, MediaStorage } from './media.types.js'
import { MediaValidationError } from './media.validation.js'

export async function registerMediaRoutes(
  app: FastifyInstance,
  env: ApiEnv,
  storageOverride?: MediaStorage,
  repositoryOverride?: MediaRepository,
): Promise<void> {
  app.post('/api/v1/media/uploads', async (request, reply) => {
    try {
      const storage = storageOverride ?? createMediaStorage(env)
      const repository = repositoryOverride ?? createMediaRepository(env)
      const upload = await createPresignedUpload(request.body, storage, repository)
      return reply.status(201).send({ upload })
    } catch (error) {
      if (error instanceof MediaValidationError) {
        return reply.status(error.statusCode).send({ error: error.message })
      }

      app.log.error(error)
      return reply.status(503).send({ error: 'Хранилище медиа недоступно' })
    }
  })
}
