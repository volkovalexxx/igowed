import { formatMoney } from '@/lib/currency/currency.format'
import { budgetSummaryLabels } from './eventBudget.data'
import type { BudgetSummaryTotals } from './eventBudget.types'
import styles from './EventBudgetPage.module.css'

export function BudgetSummary({ totals }: { totals: BudgetSummaryTotals }) {
  const tiles = [
    { key: 'total', label: budgetSummaryLabels.total, money: totals.total },
    { key: 'paid', label: budgetSummaryLabels.paid, money: totals.paid },
    { key: 'due', label: budgetSummaryLabels.due, money: totals.due },
  ]

  return (
    <div className={styles.summary}>
      {tiles.map((tile) => (
        <div className={styles.summaryTile} key={tile.key}>
          <span className={styles.summaryLabel}>{tile.label}</span>
          <span className={styles.summaryValue}>{formatMoney(tile.money)}</span>
        </div>
      ))}
    </div>
  )
}
