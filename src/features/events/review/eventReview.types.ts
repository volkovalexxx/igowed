/** Подрядчик мероприятия в карточке отзыва на странице после мероприятия. */
export type EventVendorReview = {
  id: string
  vendorId: string
  slug: string
  username: string
  name: string
  role: string
  avatar: string | null
  isPro: boolean
  rating: number
  workImage: string | null
  /** Оценка, которую текущий пользователь уже поставил, либо null. */
  myRating: number | null
}
