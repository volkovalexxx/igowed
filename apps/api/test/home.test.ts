import { describe, expect, it } from 'vitest'
import { loadEnv } from '../src/config/env.js'
import { buildServer } from '../src/server.js'

describe('home routes', () => {
  it('returns homepage sections for the first screen and content rails', async () => {
    const app = await buildServer({
      env: loadEnv({
        NODE_ENV: 'test',
        WEB_ORIGIN: 'http://localhost:3000',
      }),
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/home',
    })
    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body.hero.title).toContain('Найдите лучших подрядчиков')
    expect(body.stats).toHaveLength(4)
    expect(body.quickBenefits).toHaveLength(5)
    expect(body.serviceAdvantages).toHaveLength(3)
    expect(body.pickedForYou.length).toBeGreaterThanOrEqual(4)
    expect(body.serviceCatalog.length).toBeGreaterThanOrEqual(6)
    expect(body.blog[0]).toMatchObject({
      category: 'Советы',
      href: '/blog/dress-accessories',
    })
    expect(body.seoGroups[0].links.length).toBeGreaterThan(3)

    await app.close()
  })
})
