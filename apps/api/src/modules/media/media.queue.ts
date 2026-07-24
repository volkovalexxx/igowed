import { Queue } from 'bullmq'
import { Redis } from 'ioredis'
import type { ApiEnv } from '../../config/env.js'
import type { VariantsJobData } from './media.types.js'

export const MEDIA_VARIANTS_QUEUE = 'media-variants'

export function createRedisConnection(env: ApiEnv): Redis | undefined {
  if (!env.REDIS_URL) return undefined
  return new Redis(env.REDIS_URL, { maxRetriesPerRequest: null })
}

export function createMediaQueue(connection: Redis): Queue<VariantsJobData> {
  return new Queue<VariantsJobData>(MEDIA_VARIANTS_QUEUE, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  })
}

export async function enqueueVariantsJob(queue: Queue<VariantsJobData>, data: VariantsJobData): Promise<void> {
  await queue.add('generate', data, { jobId: data.assetId })
}
