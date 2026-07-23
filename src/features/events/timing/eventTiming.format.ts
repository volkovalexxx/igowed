import type { TimelineEntry } from './eventTiming.types'

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':')
  return Number(hours) * 60 + Number(minutes)
}

export function compareTimes(a: string, b: string): number {
  return toMinutes(a) - toMinutes(b)
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}-${endTime}`
}

export function sortEntries(entries: readonly TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => compareTimes(a.startTime, b.startTime) || a.order - b.order)
}
