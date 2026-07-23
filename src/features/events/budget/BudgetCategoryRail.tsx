import { ALL_CATEGORIES_KEY, ALL_CATEGORIES_TITLE } from './eventBudget.data'
import type { BudgetCategory } from './eventBudget.types'
import styles from './EventBudgetPage.module.css'

type BudgetCategoryRailProps = {
  categories: readonly BudgetCategory[]
  activeId: string
  onSelect(categoryId: string): void
}

type RailOption = {
  id: string
  title: string
}

function toOptions(categories: readonly BudgetCategory[]): RailOption[] {
  return [{ id: ALL_CATEGORIES_KEY, title: ALL_CATEGORIES_TITLE }, ...categories.map((c) => ({ id: c.id, title: c.title }))]
}

export function BudgetCategoryRail({ categories, activeId, onSelect }: BudgetCategoryRailProps) {
  const options = toOptions(categories)

  return (
    <>
      <div className={styles.rail} role="tablist" aria-label="Категории бюджета">
        {options.map((option) => (
          <button
            className={option.id === activeId ? `${styles.railItem} ${styles.railItemActive}` : styles.railItem}
            key={option.id}
            type="button"
            role="tab"
            aria-selected={option.id === activeId}
            onClick={() => onSelect(option.id)}
          >
            {option.title}
          </button>
        ))}
      </div>

      <label className={styles.railSelect}>
        <span className={styles.visuallyHidden}>Категория бюджета</span>
        <select value={activeId} onChange={(event) => onSelect(event.target.value)}>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.id === ALL_CATEGORIES_KEY ? 'Общий бюджет' : option.title}
            </option>
          ))}
        </select>
      </label>
    </>
  )
}
