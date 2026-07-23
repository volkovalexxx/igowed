'use client'

import { useState, type FormEvent } from 'react'
import { CURRENCY_CODES, type CurrencyCode } from '@/lib/currency/currency.types'
import { budgetFieldLabels } from './eventBudget.data'
import type { BudgetCategory, BudgetItem } from './eventBudget.types'
import styles from './EventBudgetPage.module.css'

export type BudgetItemDraft = {
  categoryId: string
  title: string
  cost: number
  paid: number
  currency: CurrencyCode
}

type BudgetItemModalProps = {
  categories: readonly BudgetCategory[]
  item: BudgetItem | null
  defaultCategoryId: string
  onClose(): void
  onSave(draft: BudgetItemDraft): Promise<void>
}

function toAmount(value: string): number {
  const parsed = Number(value.replace(/\s/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export function BudgetItemModal({ categories, item, defaultCategoryId, onClose, onSave }: BudgetItemModalProps) {
  const isEditing = item !== null

  const [categoryId, setCategoryId] = useState(defaultCategoryId)
  const [title, setTitle] = useState(item?.title ?? '')
  const [cost, setCost] = useState(String(item?.cost ?? ''))
  const [paid, setPaid] = useState(String(item?.paid ?? ''))
  const [currency, setCurrency] = useState<CurrencyCode>(item?.currency ?? 'BYN')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const due = Math.max(toAmount(cost) - toAmount(paid), 0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave({ categoryId, title, cost: toAmount(cost), paid: toAmount(paid), currency })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить статью расходов')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="budget-item-title" onSubmit={handleSubmit}>
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="budget-item-title">{isEditing ? 'Редактировать расходы' : 'Добавить статью расходов'}</h2>

        <label>
          {isEditing ? budgetFieldLabels.title : 'Название'}
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>

        {isEditing ? null : (
          <label>
            Категория
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Общая стоимость
          <input inputMode="numeric" type="text" value={cost} onChange={(event) => setCost(event.target.value)} />
        </label>

        <label>
          {budgetFieldLabels.paid}
          <input inputMode="numeric" type="text" value={paid} onChange={(event) => setPaid(event.target.value)} />
        </label>

        <label>
          {budgetFieldLabels.due}
          <input readOnly type="text" value={due} tabIndex={-1} />
        </label>

        <label>
          {budgetFieldLabels.currency}
          <select value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)}>
            {CURRENCY_CODES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <button className={styles.saveButton} type="submit" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}
