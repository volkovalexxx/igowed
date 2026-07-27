import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { toHeaderViewer } from '@/components/layout/header.helpers'
import { ProductCardPage } from '@/features/products/card/ProductCardPage'
import { productCardRepository } from '@/features/products/card/server/productCard.repository'
import { getProductBySlug } from '@/features/products/card/server/productCard.service'
import { auth } from '@/lib/auth'

type ProductRouteProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug, productCardRepository)

  if (!product) {
    return { title: 'Товар не найден | I GO WED' }
  }

  return {
    title: `${product.title} | I GO WED`,
    description: product.description ?? undefined,
  }
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { slug } = await params
  const [product, session] = await Promise.all([getProductBySlug(slug, productCardRepository), auth()])

  if (!product) {
    notFound()
  }

  return <ProductCardPage product={product} viewer={toHeaderViewer(session)} />
}
