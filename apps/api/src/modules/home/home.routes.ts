import type { FastifyInstance } from 'fastify'
import { getHomePagePayload } from './home.service.js'

export async function registerHomeRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/home', async () => getHomePagePayload())
}
