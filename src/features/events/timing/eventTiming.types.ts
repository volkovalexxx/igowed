export type TimelineEntry = {
  id: string
  startTime: string
  endTime: string
  title: string
  location: string | null
  participants: string[]
  comment: string | null
  order: number
}

export type Timeline = {
  id: string
  title: string
  order: number
  entries: TimelineEntry[]
}
