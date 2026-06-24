import type { FastifyInstance } from 'fastify'
import type { ApiEnv } from '../../config/env.js'
import { getHealthReport } from './health.service.js'

export async function registerHealthRoutes(app: FastifyInstance, env: ApiEnv): Promise<void> {
  app.get('/api/v1/health', async (_request, reply) => {
    const report = await getHealthReport(env)
    const statusCode = report.checks.database === 'degraded' ? 503 : 200

    return reply.code(statusCode).send({
      ...report,
      status: statusCode === 200 ? 'ok' : 'degraded',
    })
  })
}
