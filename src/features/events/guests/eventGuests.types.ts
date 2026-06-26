export type GuestRsvpStatus = 'confirmed' | 'declined' | 'pending'

export type GuestSide = 'bride' | 'groom'

export type EventGuest = {
  id: string
  fullName: string
  rsvpStatus: GuestRsvpStatus
  side: GuestSide
  needsTransfer: boolean
  needsAccommodation: boolean
  comment: string | null
  order: number
}
