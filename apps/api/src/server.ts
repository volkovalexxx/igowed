import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import Fastify, { type FastifyInstance } from 'fastify'
import { loadEnv, type ApiEnv } from './config/env.js'
import { registerCatalogRoutes } from './modules/catalog/catalog.routes.js'
import { registerHealthRoutes } from './modules/health/health.routes.js'
import { registerHomeRoutes } from './modules/home/home.routes.js'
import { registerMediaRoutes } from './modules/media/media.routes.js'
import type { MediaRepository, MediaStorage } from './modules/media/media.types.js'

export type BuildServerOptions = {
  env?: ApiEnv
  mediaStorage?: MediaStorage
  mediaRepository?: MediaRepository
}

export async function buildServer(options: BuildServerOptions = {}): Promise<FastifyInstance> {
  const appEnv = options.env ?? loadEnv()
  const app = Fastify({
    logger: appEnv.NODE_ENV !== 'test',
  })

  await app.register(helmet)
  await app.register(cors, {
    origin: appEnv.WEB_ORIGIN,
    credentials: true,
  })

  app.get('/api/v1', async () => ({
    name: 'I GO WED API',
    version: '0.1.0',
  }))

  await registerHealthRoutes(app, appEnv)
  await registerCatalogRoutes(app)
  await registerHomeRoutes(app)
  await registerMediaRoutes(app, appEnv, options.mediaStorage, options.mediaRepository)

  return app
}
