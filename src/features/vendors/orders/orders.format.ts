import type { OrderStatus, OrderTabKey, VendorOrder } from './orders.types'

const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Форматирует дату заявки (ISO-строка с сервера) в «14 июня 2026»; пустую дату отдаёт как «Дата не указана». */
export function formatOrderDate(iso: string | null): string {
  if (!iso) return 'Дата не указана'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Дата не указана'
  return DATE_FORMATTER.format(date).replace(/\s*г\.$/, '')
}

export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Новая', color: '#D39D55', bg: '#F5E6CC' },
  CONFIRMED: { label: 'Подтверждена', color: '#16A34A', bg: '#DCFCE7' },
  COMPLETED: { label: 'Завершена', color: '#6B6B6B', bg: '#F4F4F4' },
  CANCELLED: { label: 'Отменена', color: '#E02C2C', bg: '#FEE2E2' },
}

export const ORDER_TABS: { key: OrderTabKey; label: string; status: OrderStatus }[] = [
  { key: 'incoming', label: 'Входящие', status: 'PENDING' },
  { key: 'confirmed', label: 'Подтверждённые', status: 'CONFIRMED' },
  { key: 'completed', label: 'Завершённые', status: 'COMPLETED' },
  { key: 'cancelled', label: 'Отменённые', status: 'CANCELLED' },
]

/** Допустимые переходы статуса заявки. Завершённые и отменённые — терминальные. */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to)
}

export function filterByStatus(orders: VendorOrder[], status: OrderStatus): VendorOrder[] {
  return orders.filter((order) => order.status === status)
}

export function countByStatus(orders: VendorOrder[], status: OrderStatus): number {
  return filterByStatus(orders, status).length
}
