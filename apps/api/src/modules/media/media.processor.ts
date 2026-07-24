export const VARIANT_WIDTHS = [320, 640, 960, 1280, 1920] as const

/**
 * Ширины responsive-вариантов для оригинала. Апскейл запрещён: берём только ступени,
 * не превышающие ширину оригинала. Если оригинал уже самой мелкой ступени —
 * отдаём единственный вариант его собственной ширины.
 */
export function planVariantWidths(originalWidth: number): number[] {
  if (!Number.isFinite(originalWidth) || originalWidth <= 0) return []

  const fitting = VARIANT_WIDTHS.filter((width) => width <= originalWidth)

  if (fitting.length === 0) {
    return [Math.round(originalWidth)]
  }

  return fitting
}

/**
 * Ключ объекта варианта: сегмент `original` заменяется на `w{width}`, а если его нет —
 * файл кладётся в папку `w{width}` рядом. Расширение всегда `webp`.
 */
export function variantObjectKey(originalKey: string, width: number): string {
  const slashIndex = originalKey.lastIndexOf('/')
  const dir = slashIndex >= 0 ? originalKey.slice(0, slashIndex) : ''
  const fileName = slashIndex >= 0 ? originalKey.slice(slashIndex + 1) : originalKey

  const baseName = fileName.replace(/\.[^.]+$/, '')
  const widthDir = `w${width}`

  const scopedDir = dir.endsWith('/original') ? dir.slice(0, -'/original'.length) : dir
  const prefix = scopedDir ? `${scopedDir}/` : ''

  return `${prefix}${widthDir}/${baseName}.webp`
}
