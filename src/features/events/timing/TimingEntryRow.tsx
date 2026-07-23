'use client'

import { ParticipantChips } from './ParticipantChips'
import { TimingInlineField } from './TimingInlineField'
import { timingActionLabels, timingFieldLabels } from './eventTiming.data'
import { formatTimeRange } from './eventTiming.format'
import type { TimelineEntry } from './eventTiming.types'
import styles from './EventTimingPage.module.css'

type TimingEntryRowProps = {
  entry: TimelineEntry
  isExpanded: boolean
  onToggle(): void
  onEdit(): void
  onComment(): void
  onPatch(patch: Record<string, unknown>): Promise<void>
  onParticipantsChange(participants: string[]): void
}

export function TimingEntryRow({
  entry,
  isExpanded,
  onToggle,
  onEdit,
  onComment,
  onPatch,
  onParticipantsChange,
}: TimingEntryRowProps) {
  const commentLabel = entry.comment ? timingActionLabels.viewComment : timingActionLabels.createComment

  return (
    <>
      <div className={styles.desktopRow}>
        <span className={styles.timeCell}>
          <TimingInlineField
            className={styles.timePill}
            label={`${timingFieldLabels.start}: ${entry.title}`}
            value={entry.startTime}
            onCommit={(startTime) => onPatch({ startTime })}
          />
          <span aria-hidden="true">-</span>
          <TimingInlineField
            className={styles.timePill}
            label={`${timingFieldLabels.end}: ${entry.title}`}
            value={entry.endTime}
            onCommit={(endTime) => onPatch({ endTime })}
          />
        </span>

        <TimingInlineField
          className={styles.fieldPill}
          label={timingFieldLabels.entryTitle}
          value={entry.title}
          onCommit={(title) => onPatch({ title })}
        />

        <TimingInlineField
          className={styles.fieldPill}
          label={`${timingFieldLabels.location}: ${entry.title}`}
          placeholder="Не указана"
          value={entry.location ?? ''}
          onCommit={(location) => onPatch({ location })}
        />

        <ParticipantChips participants={entry.participants} onChange={onParticipantsChange} />

        <button className={styles.commentLink} type="button" onClick={onComment}>
          {commentLabel}
        </button>
      </div>

      <article className={styles.mobileRow}>
        <button className={styles.mobileRowHeader} type="button" onClick={onToggle} aria-expanded={isExpanded}>
          <span className={styles.mobileTime}>{formatTimeRange(entry.startTime, entry.endTime)}</span>
          <span className={styles.mobileTitle}>{entry.title}</span>
          <span aria-hidden="true">{isExpanded ? '⌃' : '⌄'}</span>
        </button>

        {isExpanded ? (
          <div className={styles.mobileRowBody}>
            <p>
              {timingFieldLabels.location}: {entry.location ?? 'не указана'}
            </p>
            <p>{timingFieldLabels.participants}:</p>
            <ParticipantChips participants={entry.participants} onChange={onParticipantsChange} />
            <div className={styles.mobileRowActions}>
              <button className={styles.commentLink} type="button" onClick={onComment}>
                {commentLabel}
              </button>
              <button
                className={styles.mobileEditButton}
                type="button"
                aria-label={`Редактировать: ${entry.title}`}
                onClick={onEdit}
              >
                ✎
              </button>
            </div>
          </div>
        ) : null}
      </article>
    </>
  )
}
