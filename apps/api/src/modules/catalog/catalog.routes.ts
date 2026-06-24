import type { FastifyInstance } from 'fastify'
import { catalogCategories } from './catalog.data.js'

export async function registerCatalogRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/catalog/categories', async () => ({
    items: [...catalogCategories].sort((left, right) => left.order - right.order),
  }))
}
