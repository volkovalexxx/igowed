import { formatAmount } from '@/lib/currency/currency.format'

const CURRENCY_LABELS: Record<string, string> = {
  RUB: 'руб',
  BYN: 'BYN',
  USD: 'USD',
  EUR: 'EUR',
}

const REVIEW_DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function currencyLabel(currency: string): string {
  return CURRENCY_LABELS[currency] ?? currency
}

export function formatProfilePrice(pricePerHour: number | null, currency: string): string {
  if (!pricePerHour) return 'Цена по запросу'
  return `от ${formatAmount(pricePerHour)} ${currencyLabel(currency)} / час`
}

export function formatServicePrice(price: number | null, currency: string, unit: string | null): string {
  if (!price) return 'Цена по запросу'
  const suffix = unit ? ` / ${unit}` : ''
  return `${formatAmount(price)} ${currencyLabel(currency)}${suffix}`
}

export function formatReviewDate(date: Date): string {
  // ru-RU добавляет « г.» в конце — в макете отзывов его нет.
  return REVIEW_DATE_FORMATTER.format(date).replace(/\s*г\.$/, '')
}
