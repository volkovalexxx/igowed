import type { OrderStatus } from '@/features/vendors/orders/orders.types'

export type ClientBookingStatus = OrderStatus

export type ClientBooking = {
  id: string
  vendorName: string
  vendorAvatar: string | null
  vendorSlug: string
  date: string | null
  message: string | null
  status: ClientBookingStatus
  /** Оставлял ли клиент прямой отзыв этому подрядчику (для CTA по завершённой заявке). */
  alreadyReviewed: boolean
}
