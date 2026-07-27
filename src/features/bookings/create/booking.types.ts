export type CreateBookingInput = {
  vendorSlug: string
  date: string | null
  message: string | null
}

export type CreatedBooking = {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  /** true, если вернули уже существующую активную заявку вместо создания новой. */
  existing: boolean
}
