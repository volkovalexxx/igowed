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
    // Presigned URL должен указывать на хост, доступный из браузера. Если публичный endpoint
    // не задан, падаем на внутренний (годится, когда клиент и хранилище в одной сети).
    publicEndpoint: new URL((env.S3_PUBLIC_ENDPOINT ?? env.S3_ENDPOINT) as string),
    publicUrl: (env.S3_PUBLIC_URL as string).replace(/\/$/, ''),
    bucket: env.S3_BUCKET as string,
    accessKey: env.S3_ACCESS_KEY as string,
    secretKey: env.S3_SECRET_KEY as string,
  }
}

export function createMediaStorage(env: ApiEnv): MediaStorage {
  const config = requireMediaEnv(env)

  function makeClient(endpoint: URL) {
    return new Client({
      endPoint: endpoint.hostname,
      port: endpoint.port ? Number(endpoint.port) : undefined,
      useSSL: endpoint.protocol === 'https:',
      // Явный регион — иначе presignedPutObject делает сетевой region-lookup к endpoint,
      // а публичный хост изнутри контейнера недостижим.
      region: 'us-east-1',
      accessKey: config.accessKey,
      secretKey: config.secretKey,
    })
  }

  const client = makeClient(config.endpoint)
  // Отдельный клиент с публичным хостом — presigned-подпись MinIO привязана к хосту в URL.
  const publicClient = makeClient(config.publicEndpoint)

  return {
    getPublicUrl(objectKey) {
      return `${config.publicUrl}/${objectKey}`
    },

    createUploadUrl(objectKey, expiresInSeconds) {
      return publicClient.presignedPutObject(config.bucket, objectKey, expiresInSeconds)
    },

    async downloadObject(objectKey) {
      const stream = await client.getObject(config.bucket, objectKey)
      const chunks: Buffer[] = []

      for await (const chunk of stream) {
        chunks.push(chunk as Buffer)
      }

      return Buffer.concat(chunks)
    },

    async uploadObject(objectKey, body, contentType) {
      await client.putObject(config.bucket, objectKey, body, body.length, { 'Content-Type': contentType })
    },
  }
}
