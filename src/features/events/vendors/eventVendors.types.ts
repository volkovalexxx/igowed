/** Подрядчик, привязанный к мероприятию, в том виде, в каком его показывает страница. */
export type EventVendorEntry = {
  id: string
  vendorId: string
  slug: string
  username: string
  name: string
  role: string
  avatar: string | null
  isPro: boolean
  rating: number
}

export type EventVendorSlot = {
  role: string
  vendors: EventVendorEntry[]
  isEmpty: boolean
}
