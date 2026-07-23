'use client'

import { CURRENCY_CODES, type CurrencyCode } from '@/lib/currency/currency.types'
import { formatAmount } from '@/lib/currency/currency.format'
import { budgetFieldLabels } from './eventBudget.data'
import { getItemDue } from './eventBudget.format'
import type { BudgetItem } from './eventBudget.types'
import styles from './EventBudgetPage.module.css'

type BudgetItemRowProps = {
  item: BudgetItem
  isExpanded: boolean
  onToggle(): void
  onEdit(): void
  onCurrencyChange(currency: CurrencyCode): void
}

function CurrencySelect({
  value,
  label,
  onChange,
}: {
  value: CurrencyCode
  label: string
  onChange(currency: CurrencyCode): void
}) {
  return (
    <label className={styles.currencySelect}>
      <span className={styles.visuallyHidden}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as CurrencyCode)}>
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </label>
  )
}

export function BudgetItemRow({ item, isExpanded, onToggle, onEdit, onCurrencyChange }: BudgetItemRowProps) {
  const due = getItemDue(item)

  return (
    <>
      <div className={styles.desktopRow}>
        <span className={styles.rowTitle}>{item.title}</span>

        <span className={styles.amountCell}>
          <b>{formatAmount(item.cost)}</b>
          <CurrencySelect label={`${budgetFieldLabels.cost}: валюта`} value={item.currency} onChange={onCurrencyChange} />
        </span>

        <span className={styles.amountCell}>
          <b>{formatAmount(item.paid)}</b>
          <CurrencySelect label={`${budgetFieldLabels.paid}: валюта`} value={item.currency} onChange={onCurrencyChange} />
        </span>

        <span className={styles.amountCell}>
          <b>{formatAmount(due)}</b>
          <CurrencySelect label={`${budgetFieldLabels.due}: валюта`} value={item.currency} onChange={onCurrencyChange} />
        </span>

        <button className={styles.editButton} type="button" aria-label={`Редактировать: ${item.title}`} onClick={onEdit}>
          ✎
        </button>
      </div>

      <article className={styles.mobileRow}>
        <button className={styles.mobileRowHeader} type="button" onClick={onToggle} aria-expanded={isExpanded}>
          <span>{item.title}</span>
          <b>
            {formatAmount(item.cost)} {item.currency}
          </b>
          <span aria-hidden="true">{isExpanded ? '⌃' : '⌄'}</span>
        </button>
        {isExpanded ? (
          <div className={styles.mobileRowBody}>
            <p>
              {budgetFieldLabels.paid}: {formatAmount(item.paid)} {item.currency}
            </p>
            <p>
              {budgetFieldLabels.due}: {formatAmount(due)} {item.currency}
            </p>
            <button className={styles.mobileEditButton} type="button" aria-label={`Редактировать: ${item.title}`} onClick={onEdit}>
              ✎
            </button>
          </div>
        ) : null}
      </article>
    </>
  )
}
