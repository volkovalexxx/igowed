export type EventPhase = 'upcoming' | 'past'

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

/**
 * Мероприятие считается завершённым со следующего календарного дня: в сам день свадьбы
 * страница должна оставаться рабочей, а не переключаться в режим отзывов посреди торжества.
 */
export function getEventPhase(eventDate: Date | null, now: Date): EventPhase {
  if (!eventDate) return 'upcoming'
  return startOfUtcDay(eventDate) < startOfUtcDay(now) ? 'past' : 'upcoming'
}

export function isEventFinished(eventDate: Date | null, now: Date): boolean {
  return getEventPhase(eventDate, now) === 'past'
}
