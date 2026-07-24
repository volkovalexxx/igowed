import { mapProductCard } from './productCard.mapper'
import type { ProductCard } from '../productCard.types'

type ProductCardDeps = {
  findProductBySlug(slug: string): Promise<Parameters<typeof mapProductCard>[0] | null>
}

export async function getProductBySlug(slug: string, deps: ProductCardDeps): Promise<ProductCard | null> {
  if (!slug) return null

  const record = await deps.findProductBySlug(slug)
  return record ? mapProductCard(record) : null
}
