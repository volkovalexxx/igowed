import { NextResponse } from 'next/server'
import { consumeRateLimit, type RateLimitRule } from './rateLimit'
import { getRateLimitStore } from './redisStore'

/** Готовые правила лимитов по типу действия. */
export const RATE_LIMITS = {
  message: { limit: 30, windowMs: 60_000 },
  review: { limit: 15, windowMs: 60_000 },
  register: { limit: 5, windowMs: 60_000 },
  password: { limit: 5, windowMs: 60_000 },
} satisfies Record<string, RateLimitRule>

export type RateLimitScope = keyof typeof RATE_LIMITS

/**
 * Проверяет лимит для действия и субъекта. Возвращает готовый 429-ответ при превышении,
 * либо null — тогда роут продолжает обработку. Fail-open при недоступном Redis.
 */
export async function enforceRateLimit(scope: RateLimitScope, subject: string): Promise<NextResponse | null> {
  const result = await consumeRateLimit(getRateLimitStore(), `rl:${scope}:${subject}`, RATE_LIMITS[scope])

  if (result.allowed) return null

  return NextResponse.json(
    { error: 'Слишком много запросов, попробуйте позже' },
    { status: 429, headers: { 'Retry-After': String(result.retryAfterSeconds) } },
  )
}
