import { Client } from 'minio'
import type { ApiEnv } from '../../config/env.js'
import type { MediaStorage } from './media.types.js'

function requireMediaEnv(env: ApiEnv) {
  const missing = [
    ['S3_ENDPOINT', env.S3_ENDPOINT],
    ['S3_PUBLIC_URL', env.S3_PUBLIC_URL],
    ['S3_BUCKET', env.S3_BUCKET],
    ['S3_ACCESS_KEY', env.S3_ACCESS_KEY],
    ['S3_SECRET_KEY', env.S3_SECRET_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missing.length > 0) {
    throw new Error(`Media storage is not configured: ${missing.join(', ')}`)
  }

  return {
    endpoint: new URL(env.S3_ENDPOINT as string),
    publicUrl: (env.S3_PUBLIC_URL as string).replace(/\/$/, ''),
    bucket: env.S3_BUCKET as string,
    accessKey: env.S3_ACCESS_KEY as string,
    secretKey: env.S3_SECRET_KEY as string,
  }
}

export function createMediaStorage(env: ApiEnv): MediaStorage {
  const config = requireMediaEnv(env)
  const client = new Client({
    endPoint: config.endpoint.hostname,
    port: config.endpoint.port ? Number(config.endpoint.port) : undefined,
    useSSL: config.endpoint.protocol === 'https:',
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  })

  return {
    getPublicUrl(objectKey) {
      return `${config.publicUrl}/${objectKey}`
    },

    createUploadUrl(objectKey, expiresInSeconds) {
      return client.presignedPutObject(config.bucket, objectKey, expiresInSeconds)
    },
  }
}
