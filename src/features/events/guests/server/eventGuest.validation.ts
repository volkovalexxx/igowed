import type { GuestRsvpStatus, GuestSide } from '../eventGuests.types'

export class EventGuestValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventGuestValidationError'
  }
}

export type CreateGuestInput = {
  fullName: string
  rsvpStatus: GuestRsvpStatus
  side: GuestSide
  needsTransfer: boolean
  needsAccommodation: boolean
  comment: string | null
}

export type UpdateGuestInput = Partial<CreateGuestInput>

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

function parseRsvp(value: unknown): GuestRsvpStatus {
  if (value === 'confirmed' || value === 'declined' || value === 'pending') return value
  return 'pending'
}

function parseSide(value: unknown): GuestSide {
  if (value === 'groom') return 'groom'
  return 'bride'
}

function parseBoolean(value: unknown) {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 'Да') return true
  return false
}

export function parseCreateGuestInput(raw: unknown): CreateGuestInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventGuestValidationError('Некорректные данные гостя')
  }

  const data = raw as Record<string, unknown>
  const fullName = cleanString(data.fullName)

  if (!fullName) {
    throw new EventGuestValidationError('Имя гостя обязательно')
  }

  return {
    fullName,
    rsvpStatus: parseRsvp(data.rsvpStatus),
    side: parseSide(data.side),
    needsTransfer: parseBoolean(data.needsTransfer),
    needsAccommodation: parseBoolean(data.needsAccommodation),
    comment: cleanString(data.comment) ?? null,
  }
}

export function parseUpdateGuestInput(raw: unknown): UpdateGuestInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventGuestValidationError('Некорректные данные гостя')
  }

  const data = raw as Record<string, unknown>
  const input: UpdateGuestInput = {}

  if ('fullName' in data) {
    const fullName = cleanString(data.fullName)
    if (!fullName) throw new EventGuestValidationError('Имя гостя обязательно')
    input.fullName = fullName
  }

  if ('rsvpStatus' in data) input.rsvpStatus = parseRsvp(data.rsvpStatus)
  if ('side' in data) input.side = parseSide(data.side)
  if ('needsTransfer' in data) input.needsTransfer = parseBoolean(data.needsTransfer)
  if ('needsAccommodation' in data) input.needsAccommodation = parseBoolean(data.needsAccommodation)
  if ('comment' in data) input.comment = cleanString(data.comment) ?? null

  if (Object.keys(input).length === 0) {
    throw new EventGuestValidationError('Нет данных для обновления')
  }

  return input
}
