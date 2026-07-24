import { describe, expect, it, vi } from 'vitest'
import { consumeRateLimit, type RateLimitStore } from './rateLimit'

function store(counts: number[]): RateLimitStore {
  const queue = [...counts]
  return {
    increment: vi.fn(async () => ({ count: queue.shift() ?? 1, ttlMs: 30_000 })),
  }
}

describe('consumeRateLimit', () => {
  it('пропускает запросы в пределах лимита', async () => {
    const result = await consumeRateLimit(store([1]), 'msg:u1', { limit: 5, windowMs: 60_000 })

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('блокирует, когда счётчик превысил лимит', async () => {
    const result = await consumeRateLimit(store([6]), 'msg:u1', { limit: 5, windowMs: 60_000 })

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('на ровно лимитном запросе ещё пропускает', async () => {
    const result = await consumeRateLimit(store([5]), 'msg:u1', { limit: 5, windowMs: 60_000 })

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(0)
  })

  it('отдаёт retryAfter в секундах из ttl', async () => {
    const result = await consumeRateLimit(store([10]), 'msg:u1', { limit: 5, windowMs: 60_000 })

    expect(result.retryAfterSeconds).toBe(30)
  })

  it('fail-open: без стора пропускает и не падает', async () => {
    const result = await consumeRateLimit(null, 'msg:u1', { limit: 5, windowMs: 60_000 })

    expect(result.allowed).toBe(true)
  })

  it('fail-open: при ошибке стора пропускает', async () => {
    const broken: RateLimitStore = {
      increment: vi.fn(async () => {
        throw new Error('redis down')
      }),
    }

    const result = await consumeRateLimit(broken, 'msg:u1', { limit: 5, windowMs: 60_000 })

    expect(result.allowed).toBe(true)
  })
})
