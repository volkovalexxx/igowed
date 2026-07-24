import type { PresignRequest, PresignResponse, UploadDeps } from './mediaUpload'

/** База API медиа-сервиса (Fastify). Отдаёт origin без `/api/v1`. */
function mediaApiBase(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'
  return url.replace(/\/$/, '')
}

async function readError(response: Response): Promise<string> {
  const payload = await response.json().catch(() => ({}))
  return (payload as { error?: string }).error ?? 'Не удалось загрузить файл'
}

/** Реальные HTTP-зависимости `uploadImage`: presign и complete идут в Fastify, PUT — прямо в хранилище. */
export const httpUploadDeps: UploadDeps = {
  async requestPresign(request: PresignRequest): Promise<PresignResponse> {
    const response = await fetch(`${mediaApiBase()}/media/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) throw new Error(await readError(response))
    return response.json()
  },

  async putObject(url, body, headers) {
    const response = await fetch(url, { method: 'PUT', headers, body })
    if (!response.ok) throw new Error('Хранилище отклонило загрузку')
  },

  async completeAsset(assetId) {
    await fetch(`${mediaApiBase()}/media/assets/${assetId}/complete`, { method: 'POST' })
  },
}
