export type RateLimitRule = {
  limit: number
  windowMs: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

/** Абстракция над хранилищем счётчиков — Redis в проде, мок в тестах. */
export type RateLimitStore = {
  /** Инкремент счётчика окна и его текущее значение + оставшийся TTL. */
  increment(key: string, windowMs: number): Promise<{ count: number; ttlMs: number }>
}

/**
 * Fixed-window счётчик. Fail-open: если стора нет или он упал — пропускаем запрос,
 * потому что лимитер не должен ронять основной функционал при недоступном Redis.
 */
export async function consumeRateLimit(
  store: RateLimitStore | null,
  key: string,
  rule: RateLimitRule,
): Promise<RateLimitResult> {
  if (!store) {
    return { allowed: true, remaining: rule.limit, retryAfterSeconds: 0 }
  }

  try {
    const { count, ttlMs } = await store.increment(key, rule.windowMs)
    const allowed = count <= rule.limit

    return {
      allowed,
      remaining: Math.max(rule.limit - count, 0),
      retryAfterSeconds: allowed ? 0 : Math.ceil(ttlMs / 1000),
    }
  } catch {
    return { allowed: true, remaining: rule.limit, retryAfterSeconds: 0 }
  }
}
