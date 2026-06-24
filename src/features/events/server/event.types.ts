export type CreateEventInput = {
  userId: string
  eventType: string
  title: string
  eventDate?: Date
  eventTime?: string
  country?: string
  city?: string
  brideName?: string
  groomName?: string
  guestMin?: number
  guestMax?: number
  budgetMin?: number
  budgetMax?: number
  format?: string
  atmospheres: string[]
  notes?: string
  coverUrl?: string
}

export type EventRecord = {
  id: string
  userId: string
  eventType: string
  title: string
  eventDate: Date | null
  eventTime: string | null
  country: string | null
  city: string | null
  brideName: string | null
  groomName: string | null
  guestMin: number | null
  guestMax: number | null
  budgetMin: number | null
  budgetMax: number | null
  format: string | null
  atmospheres: string[]
  notes: string | null
  coverUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type EventDeps = {
  createEvent(input: CreateEventInput): Promise<EventRecord>
}
