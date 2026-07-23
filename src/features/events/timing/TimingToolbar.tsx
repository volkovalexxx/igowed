import { timingActionLabels } from './eventTiming.data'
import type { Timeline } from './eventTiming.types'
import styles from './EventTimingPage.module.css'

type TimingToolbarProps = {
  timelines: readonly Timeline[]
  activeId: string
  onSelect(timelineId: string): void
  onAddTimeline(): void
  onAddEntry(): void
}

export function TimingToolbar({ timelines, activeId, onSelect, onAddTimeline, onAddEntry }: TimingToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <label className={styles.timelineSelect}>
        <span className={styles.visuallyHidden}>Выбор тайминга</span>
        <select value={activeId} onChange={(event) => onSelect(event.target.value)}>
          {timelines.map((timeline) => (
            <option key={timeline.id} value={timeline.id}>
              {timeline.title}
            </option>
          ))}
        </select>
      </label>

      <button className={styles.inlineAdd} type="button" onClick={onAddTimeline}>
        {timingActionLabels.addTimeline} <span aria-hidden="true">+</span>
      </button>

      <button className={styles.primaryAdd} type="button" disabled={timelines.length === 0} onClick={onAddEntry}>
        {timingActionLabels.addEntry} <span aria-hidden="true">+</span>
      </button>
    </div>
  )
}
