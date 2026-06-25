import { randomUUID } from 'node:crypto'
import pg from 'pg'
import type { ApiEnv } from '../../config/env.js'
import type { CreateMediaAssetInput, MediaAssetRecord, MediaOwnerType, MediaRepository } from './media.types.js'

function mapAsset(row: Record<string, unknown>): MediaAssetRecord {
  return {
    id: String(row.id),
    ownerType: row.ownerType as MediaOwnerType,
    ownerId: String(row.ownerId),
    objectKey: String(row.objectKey),
    publicUrl: String(row.publicUrl),
    fileName: String(row.fileName),
    contentType: String(row.contentType),
    sizeBytes: Number(row.sizeBytes),
    status: row.status as MediaAssetRecord['status'],
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  }
}

export function createMediaRepository(env: ApiEnv): MediaRepository | undefined {
  if (!env.DATABASE_URL) return undefined

  return {
    async createAsset(input: CreateMediaAssetInput) {
      const client = new pg.Client({ connectionString: env.DATABASE_URL })

      try {
        await client.connect()
        const result = await client.query<Record<string, unknown>>(
          `
            insert into "MediaAsset" (
              id,
              "ownerType",
              "ownerId",
              "objectKey",
              "publicUrl",
              "fileName",
              "contentType",
              "sizeBytes",
              status,
              "createdAt",
              "updatedAt"
            )
            values (
              $9,
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              now(),
              now()
            )
            returning
              id,
              "ownerType",
              "ownerId",
              "objectKey",
              "publicUrl",
              "fileName",
              "contentType",
              "sizeBytes",
              status,
              "createdAt"
          `,
          [
            input.ownerType,
            input.ownerId,
            input.objectKey,
            input.publicUrl,
            input.fileName,
            input.contentType,
            input.sizeBytes,
            input.status,
            randomUUID(),
          ],
        )
        return mapAsset(result.rows[0])
      } finally {
        await client.end().catch(() => undefined)
      }
    },

    async updateAssetStatus(id: string, status: MediaAssetRecord['status']) {
      const client = new pg.Client({ connectionString: env.DATABASE_URL })

      try {
        await client.connect()
        const result = await client.query<Record<string, unknown>>(
          `
            update "MediaAsset"
            set
              status = $2,
              "updatedAt" = now()
            where id = $1
            returning
              id,
              "ownerType",
              "ownerId",
              "objectKey",
              "publicUrl",
              "fileName",
              "contentType",
              "sizeBytes",
              status,
              "createdAt"
          `,
          [id, status],
        )
        const row = result.rows[0]
        return row ? mapAsset(row) : undefined
      } finally {
        await client.end().catch(() => undefined)
      }
    },
  }
}
