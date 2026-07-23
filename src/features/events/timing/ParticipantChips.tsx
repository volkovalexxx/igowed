'use client'

import { useState } from 'react'
import { PARTICIPANT_ROLES, timingActionLabels } from './eventTiming.data'
import styles from './EventTimingPage.module.css'

type ParticipantChipsProps = {
  participants: readonly string[]
  onChange(participants: string[]): void
}

export function ParticipantChips({ participants, onChange }: ParticipantChipsProps) {
  const [isPicking, setIsPicking] = useState(false)
  const available = PARTICIPANT_ROLES.filter((role) => !participants.includes(role))

  function add(role: string) {
    onChange([...participants, role])
    setIsPicking(false)
  }

  return (
    <div className={styles.participants}>
      <div className={styles.participantAdd}>
        {isPicking && available.length > 0 ? (
          <label>
            <span className={styles.visuallyHidden}>Выберите участника</span>
            <select autoFocus defaultValue="" onChange={(event) => add(event.target.value)}>
              <option disabled value="">
                Выбрать
              </option>
              {available.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <button type="button" disabled={available.length === 0} onClick={() => setIsPicking(true)}>
            {timingActionLabels.addParticipant} <span aria-hidden="true">+</span>
          </button>
        )}
      </div>

      <ul className={styles.chipList}>
        {participants.map((role) => (
          <li className={styles.chip} key={role}>
            {role}
            <button
              type="button"
              aria-label={`Убрать участника ${role}`}
              onClick={() => onChange(participants.filter((item) => item !== role))}
            >
              ⊗
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
