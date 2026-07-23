'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { EventWorkspaceChrome } from '@/features/events/workspace/EventWorkspaceChrome'
import { TimingCommentModal } from './TimingCommentModal'
import { TimingEntryModal, type TimelineEntryDraft } from './TimingEntryModal'
import { TimingEntryRow } from './TimingEntryRow'
import { TimingTimelineModal } from './TimingTimelineModal'
import { TimingToolbar } from './TimingToolbar'
import { timingFieldLabels } from './eventTiming.data'
import { sortEntries } from './eventTiming.format'
import type { Timeline, TimelineEntry } from './eventTiming.types'
import styles from './EventTimingPage.module.css'

type EventTimingPageProps = {
  eventId: string
  initialTimelines: Timeline[]
}

type ModalState =
  | { kind: 'timeline' }
  | { kind: 'entry'; entry: TimelineEntry | null }
  | { kind: 'comment'; entry: TimelineEntry }
  | null

async function readJsonOrThrow(response: Response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error ?? 'Не удалось сохранить изменения')
  }

  return payload
}

export function EventTimingPage({ eventId, initialTimelines }: EventTimingPageProps) {
  const [timelines, setTimelines] = useState(initialTimelines)
  const [activeTimelineId, setActiveTimelineId] = useState(initialTimelines[0]?.id ?? '')
  const [expandedEntryId, setExpandedEntryId] = useState('')
  const [modal, setModal] = useState<ModalState>(null)

  const activeTimeline = useMemo(
    () => timelines.find((timeline) => timeline.id === activeTimelineId) ?? timelines[0],
    [timelines, activeTimelineId],
  )
  const entries = useMemo(() => sortEntries(activeTimeline?.entries ?? []), [activeTimeline])

  function replaceEntry(next: TimelineEntry) {
    setTimelines((current) =>
      current.map((timeline) => ({
        ...timeline,
        entries: timeline.entries.map((entry) => (entry.id === next.id ? next : entry)),
      })),
    )
  }

  async function handleCreateTimeline(title: string) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/timing/timelines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }),
    )) as { timeline?: Timeline }

    if (payload.timeline) {
      const created = payload.timeline
      setTimelines((current) => [...current, created])
      setActiveTimelineId(created.id)
    }
  }

  async function handleCreateEntry(draft: TimelineEntryDraft) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/timing/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      }),
    )) as { entry?: TimelineEntry }

    if (payload.entry) {
      const created = payload.entry
      setTimelines((current) =>
        current.map((timeline) =>
          timeline.id === draft.timelineId ? { ...timeline, entries: [...timeline.entries, created] } : timeline,
        ),
      )
    }
  }

  async function patchEntry(entryId: string, body: Record<string, unknown>) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/timing/entries/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )) as { entry?: TimelineEntry }

    if (payload.entry) replaceEntry(payload.entry)
  }

  async function handleUpdateEntry(entry: TimelineEntry, draft: TimelineEntryDraft) {
    await patchEntry(entry.id, {
      startTime: draft.startTime,
      endTime: draft.endTime,
      title: draft.title,
      location: draft.location,
      participants: draft.participants,
      comment: draft.comment,
    })
  }

  async function handleParticipantsChange(entry: TimelineEntry, participants: string[]) {
    const previous = entry
    replaceEntry({ ...entry, participants })

    try {
      await patchEntry(entry.id, { participants })
    } catch {
      replaceEntry(previous)
    }
  }

  return (
    <EventWorkspaceChrome active="timing" eventId={eventId}>
      <main className={styles.content}>
        <div className={styles.mobileContext}>
          <Link href={`/event/${eventId}`} aria-label="Назад к мероприятию">
            ‹
          </Link>
          <span>Тайминг</span>
        </div>
        <div className={styles.breadcrumbs}>Главная › Моя свадьба › Тайминг</div>

        <section className={styles.headingRow}>
          <h1>Тайминг</h1>
          <TimingToolbar
            activeId={activeTimeline?.id ?? ''}
            timelines={timelines}
            onSelect={setActiveTimelineId}
            onAddTimeline={() => setModal({ kind: 'timeline' })}
            onAddEntry={() => setModal({ kind: 'entry', entry: null })}
          />
        </section>

        <div className={styles.tableHead}>
          <span>{timingFieldLabels.time}</span>
          <span>{timingFieldLabels.title}</span>
          <span>{timingFieldLabels.location}</span>
          <span>{timingFieldLabels.participants}</span>
          <span>{timingFieldLabels.comment}</span>
        </div>

        <div className={styles.tableBody}>
          {entries.map((entry) => (
            <TimingEntryRow
              key={entry.id}
              entry={entry}
              isExpanded={expandedEntryId === entry.id}
              onToggle={() => setExpandedEntryId(expandedEntryId === entry.id ? '' : entry.id)}
              onEdit={() => setModal({ kind: 'entry', entry })}
              onComment={() => setModal({ kind: 'comment', entry })}
              onPatch={(patch) => patchEntry(entry.id, patch)}
              onParticipantsChange={(participants) => handleParticipantsChange(entry, participants)}
            />
          ))}
          {entries.length === 0 ? <p className={styles.empty}>Событий пока нет</p> : null}
        </div>
      </main>

      {modal?.kind === 'timeline' ? (
        <TimingTimelineModal onClose={() => setModal(null)} onSave={handleCreateTimeline} />
      ) : null}

      {modal?.kind === 'entry' ? (
        <TimingEntryModal
          defaultTimelineId={activeTimeline?.id ?? ''}
          entry={modal.entry}
          timelines={timelines}
          onClose={() => setModal(null)}
          onSave={(draft) => (modal.entry ? handleUpdateEntry(modal.entry, draft) : handleCreateEntry(draft))}
        />
      ) : null}

      {modal?.kind === 'comment' ? (
        <TimingCommentModal
          comment={modal.entry.comment ?? ''}
          onClose={() => setModal(null)}
          onSave={(comment) => patchEntry(modal.entry.id, { comment })}
        />
      ) : null}
    </EventWorkspaceChrome>
  )
}
