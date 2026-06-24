import { describe, expect, it } from 'vitest'
import { loadEnv } from '../src/config/env.js'
import { buildServer } from '../src/server.js'

describe('health routes', () => {
  it('returns ok when database is not configured', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      status: 'ok',
      service: 'api',
      checks: {
        api: 'ok',
        database: 'not_configured',
      },
    })

    await app.close()
  })
})
