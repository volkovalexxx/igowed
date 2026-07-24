import pg from 'pg'
import type { ApiEnv } from '../../config/env.js'
import type { MediaVariantsRepository, ProcessedMedia } from './media.types.js'

export function createMediaVariantsRepository(env: ApiEnv): MediaVariantsRepository | undefined {
  if (!env.DATABASE_URL) return undefined

  const connectionString = env.DATABASE_URL

  async function withClient<T>(run: (client: pg.Client) => Promise<T>): Promise<T> {
    const client = new pg.Client({ connectionString })
    try {
      await client.connect()
      return await run(client)
    } finally {
      await client.end().catch(() => undefined)
    }
  }

  return {
    async markProcessed(id: string, processed: ProcessedMedia) {
      await withClient((client) =>
        client.query(
          `
            update "MediaAsset"
            set status = 'PROCESSED',
                width = $2,
                height = $3,
                "blurDataUrl" = $4,
                variants = $5::jsonb,
                "updatedAt" = now()
            where id = $1
          `,
          [id, processed.width, processed.height, processed.blurDataUrl, JSON.stringify(processed.variants)],
        ),
      )
    },

    async markFailed(id: string) {
      await withClient((client) =>
        client.query(`update "MediaAsset" set status = 'FAILED', "updatedAt" = now() where id = $1`, [id]),
      )
    },

    async findObjectKey(id: string) {
      return withClient(async (client) => {
        const result = await client.query<{ objectKey: string; contentType: string }>(
          `select "objectKey", "contentType" from "MediaAsset" where id = $1`,
          [id],
        )
        return result.rows[0]
      })
    },
  }
}
