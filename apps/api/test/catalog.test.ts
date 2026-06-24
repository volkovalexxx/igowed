import { describe, expect, it } from 'vitest'
import { loadEnv } from '../src/config/env.js'
import { buildServer } from '../src/server.js'

describe('catalog routes', () => {
  it('returns ordered homepage categories', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/catalog/categories',
    })
    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body.items).toHaveLength(10)
    expect(body.items[0]).toMatchObject({
      id: 'suits',
      slug: 'kostyumy',
      title: 'Костюмы',
    })

    await app.close()
  })
})
