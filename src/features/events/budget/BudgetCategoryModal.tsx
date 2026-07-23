'use client'

import { useState, type FormEvent } from 'react'
import styles from './EventBudgetPage.module.css'

type BudgetCategoryModalProps = {
  onClose(): void
  onSave(title: string): Promise<void>
}

export function BudgetCategoryModal({ onClose, onSave }: BudgetCategoryModalProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave(title)
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить категорию')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-budget-category-title"
        onSubmit={handleSubmit}
      >
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="create-budget-category-title">Добавить категорию</h2>
        <label>
          Название категории
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button className={styles.saveButton} type="submit" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}
