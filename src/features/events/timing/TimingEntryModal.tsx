'use client'

import { useState, type FormEvent } from 'react'
import { ParticipantChips } from './ParticipantChips'
import { timingFieldLabels } from './eventTiming.data'
import type { Timeline, TimelineEntry } from './eventTiming.types'
import styles from './EventTimingPage.module.css'

export type TimelineEntryDraft = {
  timelineId: string
  startTime: string
  endTime: string
  title: string
  location: string
  participants: string[]
  comment: string
}

type TimingEntryModalProps = {
  timelines: readonly Timeline[]
  entry: TimelineEntry | null
  defaultTimelineId: string
  onClose(): void
  onSave(draft: TimelineEntryDraft): Promise<void>
}

export function TimingEntryModal({ timelines, entry, defaultTimelineId, onClose, onSave }: TimingEntryModalProps) {
  const isEditing = entry !== null

  const [timelineId, setTimelineId] = useState(defaultTimelineId)
  const [startTime, setStartTime] = useState(entry?.startTime ?? '')
  const [endTime, setEndTime] = useState(entry?.endTime ?? '')
  const [title, setTitle] = useState(entry?.title ?? '')
  const [location, setLocation] = useState(entry?.location ?? '')
  const [participants, setParticipants] = useState<string[]>(entry?.participants ?? [])
  const [comment, setComment] = useState(entry?.comment ?? '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave({ timelineId, startTime, endTime, title, location, participants, comment })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить событие')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="timing-entry-title" onSubmit={handleSubmit}>
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="timing-entry-title">{isEditing ? 'Редактировать событие' : 'Добавить событие'}</h2>

        <div className={styles.modalTimeRow}>
          <label>
            {timingFieldLabels.start}
            <input
              type="text"
              inputMode="numeric"
              placeholder="ЧЧ:ММ"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
          </label>
          <label>
            {timingFieldLabels.end}
            <input
              type="text"
              inputMode="numeric"
              placeholder="ЧЧ:ММ"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
            />
          </label>
        </div>

        <label>
          {timingFieldLabels.entryTitle}
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>

        <label>
          {timingFieldLabels.location}
          <input type="text" value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>

        {isEditing ? null : (
          <label>
            Тайминг
            <select value={timelineId} onChange={(event) => setTimelineId(event.target.value)} required>
              {timelines.map((timeline) => (
                <option key={timeline.id} value={timeline.id}>
                  {timeline.title}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className={styles.modalParticipants}>
          <span>{timingFieldLabels.participants}</span>
          <ParticipantChips participants={participants} onChange={setParticipants} />
        </div>

        <label>
          {timingFieldLabels.comment}
          <textarea rows={4} value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <button className={styles.saveButton} type="submit" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}
