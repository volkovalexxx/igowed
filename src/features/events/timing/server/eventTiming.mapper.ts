import { sortEntries } from '../eventTiming.format'
import type { Timeline, TimelineEntry } from '../eventTiming.types'

type TimelineEntryRecord = {
  id: string
  startTime: string
  endTime: string
  title: string
  location: string | null
  participants: string[]
  comment: string | null
  order: number
}

type TimelineRecord = {
  id: string
  title: string
  order: number
  entries: TimelineEntryRecord[]
}

export function mapTimelineEntryRecord(entry: TimelineEntryRecord): TimelineEntry {
  return {
    id: entry.id,
    startTime: entry.startTime,
    endTime: entry.endTime,
    title: entry.title,
    location: entry.location,
    participants: entry.participants,
    comment: entry.comment,
    order: entry.order,
  }
}

export function mapTimelineRecord(timeline: TimelineRecord): Timeline {
  return {
    id: timeline.id,
    title: timeline.title,
    order: timeline.order,
    entries: sortEntries(timeline.entries.map(mapTimelineEntryRecord)),
  }
}
