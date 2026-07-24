import { Worker, type Job } from 'bullmq'
import type { Redis } from 'ioredis'
import { buildProcessedMedia } from './media.pipeline.js'
import { MEDIA_VARIANTS_QUEUE } from './media.queue.js'
import type { MediaStorage, MediaVariantsRepository, VariantsJobData } from './media.types.js'

type MediaWorkerDeps = {
  connection: Redis
  storage: MediaStorage
  repository: MediaVariantsRepository
  logger?: Pick<Console, 'info' | 'error'>
}

/** Обрабатывает одно задание генерации вариантов: строит их и фиксирует результат в БД. */
export async function processVariantsJob(job: Job<VariantsJobData>, deps: MediaWorkerDeps): Promise<void> {
  const { assetId, objectKey } = job.data

  try {
    const processed = await buildProcessedMedia(objectKey, deps.storage)
    await deps.repository.markProcessed(assetId, processed)
    deps.logger?.info(`media variants ready: ${assetId} (${processed.variants.length})`)
  } catch (error) {
    await deps.repository.markFailed(assetId)
    deps.logger?.error(`media variants failed: ${assetId}`)
    throw error
  }
}

export function createMediaWorker(deps: MediaWorkerDeps): Worker<VariantsJobData> {
  return new Worker<VariantsJobData>(MEDIA_VARIANTS_QUEUE, (job) => processVariantsJob(job, deps), {
    connection: deps.connection,
    concurrency: 2,
  })
}
