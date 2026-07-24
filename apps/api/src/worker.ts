import { env } from './config/env.js'
import { createMediaStorage } from './modules/media/media.storage.js'
import { createMediaVariantsRepository } from './modules/media/media.variantsRepository.js'
import { createMediaWorker } from './modules/media/media.worker.js'
import { createRedisConnection } from './modules/media/media.queue.js'

function main() {
  const connection = createRedisConnection(env)
  if (!connection) {
    console.error('REDIS_URL is not configured — media worker cannot start')
    process.exit(1)
  }

  const repository = createMediaVariantsRepository(env)
  if (!repository) {
    console.error('DATABASE_URL is not configured — media worker cannot start')
    process.exit(1)
  }

  const storage = createMediaStorage(env)
  const worker = createMediaWorker({ connection, storage, repository, logger: console })

  worker.on('failed', (job, error) => {
    console.error(`job ${job?.id} failed:`, error.message)
  })

  console.info('media variants worker started')

  const shutdown = async () => {
    await worker.close()
    await connection.quit()
    process.exit(0)
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

main()
