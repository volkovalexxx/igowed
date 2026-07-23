'use client'

import { useState } from 'react'

type TimingInlineFieldProps = {
  value: string
  label: string
  className: string
  placeholder?: string
  onCommit(value: string): Promise<void>
}

/**
 * Поле таблицы тайминга, редактируемое на месте: сохраняется по потере фокуса или Enter.
 * Значение с сервера подхватывается во время рендера, отклонённая правка откатывается.
 */
export function TimingInlineField({ value, label, className, placeholder, onCommit }: TimingInlineFieldProps) {
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  async function commit() {
    const next = draft.trim()
    if (next === value.trim()) return

    try {
      await onCommit(next)
    } catch {
      setDraft(value)
    }
  }

  return (
    <input
      aria-label={label}
      className={className}
      placeholder={placeholder}
      type="text"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          event.currentTarget.blur()
        }
        if (event.key === 'Escape') {
          setDraft(value)
        }
      }}
    />
  )
}
