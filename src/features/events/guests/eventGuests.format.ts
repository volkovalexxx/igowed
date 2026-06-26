import type { EventGuest, GuestRsvpStatus, GuestSide } from './eventGuests.types'
import { rsvpLabels, sideLabels } from './eventGuests.data'

export function getRsvpLabel(status: GuestRsvpStatus) {
  return rsvpLabels[status]
}

export function getSideLabel(side: GuestSide) {
  return sideLabels[side]
}

export function filterGuestsByStatus(guests: EventGuest[], status: 'all' | GuestRsvpStatus) {
  if (status === 'all') return guests
  return guests.filter((guest) => guest.rsvpStatus === status)
}
