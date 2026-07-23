'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { EventWorkspaceChrome } from '@/features/events/workspace/EventWorkspaceChrome'
import type { CurrencyCode } from '@/lib/currency/currency.types'
import { BudgetCategoryModal } from './BudgetCategoryModal'
import { BudgetCategoryRail } from './BudgetCategoryRail'
import { BudgetItemModal, type BudgetItemDraft } from './BudgetItemModal'
import { BudgetItemRow } from './BudgetItemRow'
import { BudgetSummary } from './BudgetSummary'
import { ALL_CATEGORIES_KEY, budgetFieldLabels } from './eventBudget.data'
import { selectCategoryItems, summarizeBudget } from './eventBudget.format'
import type { BudgetCategory, BudgetItem } from './eventBudget.types'
import styles from './EventBudgetPage.module.css'

type EventBudgetPageProps = {
  eventId: string
  initialCategories: BudgetCategory[]
  summaryCurrency: CurrencyCode
}

type ModalState = { kind: 'category' } | { kind: 'item'; item: BudgetItem | null } | null

async function readJsonOrThrow(response: Response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error ?? 'Не удалось сохранить изменения')
  }

  return payload
}

export function EventBudgetPage({ eventId, initialCategories, summaryCurrency }: EventBudgetPageProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ALL_CATEGORIES_KEY)
  const [expandedItemId, setExpandedItemId] = useState('')
  const [modal, setModal] = useState<ModalState>(null)

  const visibleItems = useMemo(() => selectCategoryItems(categories, activeCategoryId), [categories, activeCategoryId])
  const totals = useMemo(() => summarizeBudget(visibleItems, summaryCurrency), [visibleItems, summaryCurrency])

  const newItemCategoryId = activeCategoryId === ALL_CATEGORIES_KEY ? (categories[0]?.id ?? '') : activeCategoryId

  function replaceItem(next: BudgetItem) {
    setCategories((current) =>
      current.map((category) => ({
        ...category,
        items: category.items.map((item) => (item.id === next.id ? next : item)),
      })),
    )
  }

  async function handleCreateCategory(title: string) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/budget/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }),
    )) as { category?: BudgetCategory }

    if (payload.category) {
      setCategories((current) => [...current, payload.category as BudgetCategory])
    }
  }

  async function handleCreateItem(draft: BudgetItemDraft) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/budget/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      }),
    )) as { item?: BudgetItem }

    if (payload.item) {
      const created = payload.item
      setCategories((current) =>
        current.map((category) => (category.id === draft.categoryId ? { ...category, items: [...category.items, created] } : category)),
      )
    }
  }

  async function patchItem(itemId: string, body: Record<string, unknown>) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/budget/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )) as { item?: BudgetItem }

    if (payload.item) replaceItem(payload.item)
  }

  async function handleUpdateItem(item: BudgetItem, draft: BudgetItemDraft) {
    await patchItem(item.id, { title: draft.title, cost: draft.cost, paid: draft.paid, currency: draft.currency })
  }

  async function handleCurrencyChange(item: BudgetItem, currency: CurrencyCode) {
    const previous = item
    replaceItem({ ...item, currency })

    try {
      await patchItem(item.id, { currency })
    } catch {
      replaceItem(previous)
    }
  }

  return (
    <EventWorkspaceChrome active="budget" eventId={eventId}>
      <main className={styles.content}>
        <div className={styles.mobileContext}>
          <Link href={`/event/${eventId}`} aria-label="Назад к мероприятию">
            ‹
          </Link>
          <span>Бюджет</span>
        </div>
        <div className={styles.breadcrumbs}>Главная › Моя свадьба › Бюджет</div>

        <div className={styles.layout}>
          <div className={styles.railColumn}>
            <div className={styles.railHeading}>
              <h1>Бюджет</h1>
              <button type="button" onClick={() => setModal({ kind: 'category' })}>
                Добавить категорию <span>+</span>
              </button>
            </div>
            <BudgetCategoryRail activeId={activeCategoryId} categories={categories} onSelect={setActiveCategoryId} />
          </div>

          <div className={styles.tableColumn}>
            <div className={styles.summaryRow}>
              <BudgetSummary totals={totals} />
              <button
                className={styles.addItemButton}
                type="button"
                disabled={categories.length === 0}
                onClick={() => setModal({ kind: 'item', item: null })}
              >
                Добавить статью расходов <span>+</span>
              </button>
            </div>

            <div className={styles.tableHead}>
              <span>{budgetFieldLabels.title}</span>
              <span>{budgetFieldLabels.cost}</span>
              <span>{budgetFieldLabels.paid}</span>
              <span>{budgetFieldLabels.due}</span>
              <span />
            </div>

            <div className={styles.tableBody}>
              {visibleItems.map((item) => (
                <BudgetItemRow
                  key={item.id}
                  item={item}
                  isExpanded={expandedItemId === item.id}
                  onToggle={() => setExpandedItemId(expandedItemId === item.id ? '' : item.id)}
                  onEdit={() => setModal({ kind: 'item', item })}
                  onCurrencyChange={(currency) => handleCurrencyChange(item, currency)}
                />
              ))}
              {visibleItems.length === 0 ? <p className={styles.empty}>Статей расходов пока нет</p> : null}
            </div>
          </div>
        </div>
      </main>

      {modal?.kind === 'category' ? (
        <BudgetCategoryModal onClose={() => setModal(null)} onSave={handleCreateCategory} />
      ) : null}

      {modal?.kind === 'item' ? (
        <BudgetItemModal
          categories={categories}
          defaultCategoryId={newItemCategoryId}
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={(draft) => (modal.item ? handleUpdateItem(modal.item, draft) : handleCreateItem(draft))}
        />
      ) : null}
    </EventWorkspaceChrome>
  )
}
