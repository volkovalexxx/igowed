import type { EventGuest, GuestRsvpStatus, GuestSide } from '../eventGuests.types'

export type GuestRecord = {
  id: string
  fullName: string
  rsvpStatus: string
  side: string
  needsTransfer: boolean
  needsAccommodation: boolean
  comment: string | null
  order: number
}

function normalizeRsvp(status: string): GuestRsvpStatus {
  if (status === 'confirmed' || status === 'declined') return status
  return 'pending'
}

function normalizeSide(side: string): GuestSide {
  return side === 'groom' ? 'groom' : 'bride'
}

export function mapGuestRecord(guest: GuestRecord): EventGuest {
  return {
    id: guest.id,
    fullName: guest.fullName,
    rsvpStatus: normalizeRsvp(guest.rsvpStatus),
    side: normalizeSide(guest.side),
    needsTransfer: guest.needsTransfer,
    needsAccommodation: guest.needsAccommodation,
    comment: guest.comment,
    order: guest.order,
  }
}
