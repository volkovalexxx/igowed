import { describe, expect, it, vi } from 'vitest'
import { uploadImage, type UploadDeps } from './mediaUpload'

const PRESIGN = {
  upload: {
    uploadUrl: 'http://localhost:9000/igowed-media/vendor/v1/original/x.png?sig=1',
    publicUrl: 'http://localhost:9000/igowed-media/vendor/v1/original/x.png',
    objectKey: 'vendor/v1/original/x.png',
    asset: { id: 'asset-1' },
    headers: { 'Content-Type': 'image/png' },
  },
}

function file(): File {
  return new File([new Uint8Array([1, 2, 3])], 'photo.png', { type: 'image/png' })
}

function deps(overrides: Partial<UploadDeps> = {}): UploadDeps {
  return {
    requestPresign: vi.fn(async () => PRESIGN),
    putObject: vi.fn(async () => undefined),
    completeAsset: vi.fn(async () => undefined),
    ...overrides,
  }
}

describe('uploadImage', () => {
  it('проходит presign → PUT → complete и отдаёт публичный URL', async () => {
    const dependencies = deps()
    const result = await uploadImage(file(), { ownerType: 'vendor', ownerId: 'v1' }, dependencies)

    expect(result.publicUrl).toBe(PRESIGN.upload.publicUrl)
    expect(dependencies.putObject).toHaveBeenCalledWith(PRESIGN.upload.uploadUrl, expect.any(File), PRESIGN.upload.headers)
    expect(dependencies.completeAsset).toHaveBeenCalledWith('asset-1')
  })

  it('передаёт метаданные файла в presign-запрос', async () => {
    const dependencies = deps()
    await uploadImage(file(), { ownerType: 'vendor', ownerId: 'v1' }, dependencies)

    expect(dependencies.requestPresign).toHaveBeenCalledWith({
      ownerType: 'vendor',
      ownerId: 'v1',
      fileName: 'photo.png',
      contentType: 'image/png',
      sizeBytes: 3,
    })
  })

  it('отклоняет не-изображение до сети', async () => {
    const dependencies = deps()
    const textFile = new File(['hi'], 'note.txt', { type: 'text/plain' })

    await expect(uploadImage(textFile, { ownerType: 'vendor', ownerId: 'v1' }, dependencies)).rejects.toThrow('Только изображения')
    expect(dependencies.requestPresign).not.toHaveBeenCalled()
  })

  it('отклоняет слишком большой файл', async () => {
    const dependencies = deps()
    const big = new File([new Uint8Array(11 * 1024 * 1024)], 'big.png', { type: 'image/png' })

    await expect(uploadImage(big, { ownerType: 'vendor', ownerId: 'v1' }, dependencies)).rejects.toThrow('не больше 10')
    expect(dependencies.requestPresign).not.toHaveBeenCalled()
  })

  it('не помечает complete, если presign не вернул asset', async () => {
    const dependencies = deps({ requestPresign: vi.fn(async () => ({ upload: { ...PRESIGN.upload, asset: undefined } })) })
    await uploadImage(file(), { ownerType: 'vendor', ownerId: 'v1' }, dependencies)

    expect(dependencies.completeAsset).not.toHaveBeenCalled()
  })
})
