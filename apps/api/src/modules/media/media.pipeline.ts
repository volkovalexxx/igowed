import sharp from 'sharp'
import { planVariantWidths, variantObjectKey } from './media.processor.js'
import type { MediaStorage, MediaVariant, ProcessedMedia } from './media.types.js'

const WEBP_QUALITY = 82
const BLUR_WIDTH = 16

/**
 * Строит responsive-варианты оригинала: скачивает из хранилища, генерирует WebP по ступеням
 * ширины (без апскейла), возвращает blur-placeholder как data-URL и метаданные оригинала.
 * Загрузка вариантов идёт через переданное хранилище.
 */
export async function buildProcessedMedia(objectKey: string, storage: MediaStorage): Promise<ProcessedMedia> {
  const original = await storage.downloadObject(objectKey)
  const metadata = await sharp(original).metadata()

  const width = metadata.width ?? 0
  const height = metadata.height ?? 0

  const widths = planVariantWidths(width)
  const variants: MediaVariant[] = []

  for (const targetWidth of widths) {
    const buffer = await sharp(original)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer()

    const key = variantObjectKey(objectKey, targetWidth)
    await storage.uploadObject(key, buffer, 'image/webp')

    variants.push({ width: targetWidth, objectKey: key, url: storage.getPublicUrl(key) })
  }

  const blur = await sharp(original).resize({ width: BLUR_WIDTH }).webp({ quality: 40 }).toBuffer()
  const blurDataUrl = `data:image/webp;base64,${blur.toString('base64')}`

  return { width, height, blurDataUrl, variants }
}
