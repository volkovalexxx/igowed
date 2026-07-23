'use client'

import { useState, type FormEvent } from 'react'
import { timingFieldLabels } from './eventTiming.data'
import styles from './EventTimingPage.module.css'

type TimingCommentModalProps = {
  comment: string
  onClose(): void
  onSave(comment: string): Promise<void>
}

export function TimingCommentModal({ comment, onClose, onSave }: TimingCommentModalProps) {
  const [value, setValue] = useState(comment)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave(value)
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить комментарий')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form
        className={`${styles.modal} ${styles.commentModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="timing-comment-title"
        onSubmit={handleSubmit}
      >
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <label id="timing-comment-title">
          {timingFieldLabels.comment}
          <textarea autoFocus rows={5} value={value} onChange={(event) => setValue(event.target.value)} />
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <button className={styles.saveButton} type="submit" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}
