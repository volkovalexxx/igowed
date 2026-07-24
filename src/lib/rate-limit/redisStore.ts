import { Redis } from 'ioredis'
import type { RateLimitStore } from './rateLimit'

let cachedRedis: Redis | null | undefined

/** Ленивое подключение к Redis. Возвращает null, если REDIS_URL не задан. */
function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis

  const url = process.env.REDIS_URL
  if (!url) {
    cachedRedis = null
    return null
  }

  const client = new Redis(url, { maxRetriesPerRequest: 1, lazyConnect: false })
  client.on('error', () => {
    // Тихо игнорируем: лимитер fail-open, недоступный Redis не должен ломать запросы.
  })

  cachedRedis = client
  return client
}

/**
 * Fixed-window стор на Redis: INCR ключа окна и выставление TTL на первом инкременте.
 * PTTL возвращает остаток окна для заголовка Retry-After.
 */
export function getRateLimitStore(): RateLimitStore | null {
  const redis = getRedis()
  if (!redis) return null

  return {
    async increment(key, windowMs) {
      const count = await redis.incr(key)
      if (count === 1) {
        await redis.pexpire(key, windowMs)
      }

      const ttl = await redis.pttl(key)
      return { count, ttlMs: ttl > 0 ? ttl : windowMs }
    },
  }
}
