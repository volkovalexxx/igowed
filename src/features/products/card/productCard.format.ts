import { formatAmount } from '@/lib/currency/currency.format'
import type { Breadcrumb, ProductCard } from './productCard.types'

/** Отображаемые названия валют. Код без записи показываем как есть. */
const CURRENCY_LABELS: Record<string, string> = {
  RUB: 'руб',
  BYN: 'BYN',
  USD: 'USD',
  EUR: 'EUR',
}

export function formatProductPrice(product: ProductCard): string {
  if (product.price === null) return 'Цена по запросу'

  const currency = CURRENCY_LABELS[product.currency] ?? product.currency
  const prefix = product.pricePrefix ? 'от ' : ''
  const unit = product.unit ? ` / ${product.unit}` : ''

  return `${prefix}${formatAmount(product.price)} ${currency}${unit}`
}

export function buildProductBreadcrumbs(product: ProductCard): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
  ]

  if (product.categoryName && product.categorySlug) {
    crumbs.push({ label: product.categoryName, href: `/catalog?cat=${product.categorySlug}` })
  }

  crumbs.push({ label: product.title, href: null })

  return crumbs
}
