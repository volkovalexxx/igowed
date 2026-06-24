import pg from 'pg'
import type { ApiEnv } from '../../config/env.js'

export type HealthStatus = 'ok' | 'degraded'

export type HealthReport = {
  status: HealthStatus
  service: 'api'
  checks: {
    api: 'ok'
    database: HealthStatus | 'not_configured'
  }
}

export async function getHealthReport(env: ApiEnv): Promise<HealthReport> {
  return {
    status: 'ok',
    service: 'api',
    checks: {
      api: 'ok',
      database: await checkDatabase(env.DATABASE_URL),
    },
  }
}

async function checkDatabase(databaseUrl?: string): Promise<HealthReport['checks']['database']> {
  if (!databaseUrl) return 'not_configured'

  const client = new pg.Client({ connectionString: databaseUrl })

  try {
    await client.connect()
    await client.query('select 1')
    return 'ok'
  } catch {
    return 'degraded'
  } finally {
    await client.end().catch(() => undefined)
  }
}
