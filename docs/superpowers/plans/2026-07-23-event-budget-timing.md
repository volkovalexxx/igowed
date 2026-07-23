# Event Budget and Timing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Закрыть две мёртвые вкладки воркспейса мероприятия — Бюджет и Тайминг — по макетам из `reference-image/`, предварительно вынеся продублированный чром страниц в общий модуль.

**Architecture:** Сначала общий `EventWorkspaceChrome` заменяет две дословные копии хедера и футера в `tasks` и `guests`. Затем каждая фича собирается вертикальным срезом по устоявшемуся паттерну репозитория: Prisma-модели → `server/` слой `validation → mapper → repository → service` → тонкие route handlers → клиентская страница. Модуль конвертации валют живёт в `src/lib/currency/` и не зависит ни от одной фичи.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Prisma 7 + PostgreSQL, NextAuth 5, Vitest.

Спек: [2026-07-23-event-budget-timing-design.md](../specs/2026-07-23-event-budget-timing-design.md)

## Global Constraints

- Ветка-цель для всех PR — `client`. Порядок веток обязателен: чром → бюджет → тайминг.
- В коммитах и PR не должно быть AI-атрибуции: ни `Co-Authored-By`, ни упоминаний ассистента. Сообщение коммита — одна строка в стиле истории репозитория: `feat(web): ...`, `fix(web): ...`, `chore(docs): ...`.
- Файлы дробим на мелкие однозадачные модули. Типы, данные, чистые функции и компоненты — отдельными импортируемыми файлами.
- Серверный слой каждой фичи делится на `validation → mapper → repository → service`, как в `src/features/events/tasks/server/`.
- Тестами покрывается только чистая логика: `*.format.ts`, `server/*.service.ts`, `server/*.validation.ts`, `src/lib/currency/*`. Компонентных тестов в проекте нет — не заводим.
- Все тексты интерфейса на русском. Сообщения ошибок валидации — тоже.
- Репозитории фильтруют по `event.userId` во всех запросах: чужое мероприятие неотличимо от несуществующего.
- Суммы — целые числа (`Int`), дробных денежных единиц в проекте нет.
- Локальная проверка перед каждым PR повторяет CI: `npm run db:generate && npm run lint && npm run build && npm run test`.
- Docker-стек не поднят. `npm run db:push` требует живого Postgres и выполняется вручную при поднятом стеке; на тесты и сборку это не влияет.

---

## File Structure

### Ветка 1 — `feature/event-workspace-chrome`

| Файл | Ответственность |
| --- | --- |
| `src/features/events/workspace/workspaceTabs.ts` | определения семи вкладок и построение href |
| `src/features/events/workspace/workspaceTabs.test.ts` | тесты вкладок |
| `src/features/events/workspace/EventWorkspaceHeader.tsx` | топбар: лого, основная навигация, действия |
| `src/features/events/workspace/EventWorkspaceNav.tsx` | вкладки воркспейса с активной |
| `src/features/events/workspace/EventWorkspaceFooter.tsx` | футер |
| `src/features/events/workspace/EventWorkspaceChrome.tsx` | композиция чрома вокруг `children` |
| `src/features/events/workspace/EventWorkspaceChrome.module.css` | перенесённые общие селекторы |
| `src/features/events/tasks/EventTasksPage.tsx` | минус локальные `Header`/`Footer` |
| `src/features/events/tasks/EventTasksPage.module.css` | минус общие селекторы |
| `src/features/events/guests/EventGuestsPage.tsx` | минус локальные `Header`/`Footer` |
| `src/features/events/guests/EventGuestsPage.module.css` | минус общие селекторы |
| `src/features/events/create/createEvent.constants.ts` | метки вкладок берутся из `workspaceTabs` |

### Ветка 2 — `feature/event-budget`

| Файл | Ответственность |
| --- | --- |
| `src/lib/currency/currency.types.ts` | `CurrencyCode`, `Money` |
| `src/lib/currency/currency.rates.ts` | таблица курсов, база, дата актуальности |
| `src/lib/currency/currency.convert.ts` | `convertMoney`, `sumMoney` |
| `src/lib/currency/currency.format.ts` | `formatMoney`, `formatAmount` |
| `src/lib/currency/currency.convert.test.ts` | тесты конвертации |
| `src/lib/currency/currency.format.test.ts` | тесты форматирования |
| `prisma/schema.prisma` | `EventBudgetCategory`, `EventBudgetItem`, `Event.budgetCurrency` |
| `src/features/events/budget/eventBudget.types.ts` | доменные типы фичи |
| `src/features/events/budget/eventBudget.data.ts` | категории по умолчанию, метки, список валют |
| `src/features/events/budget/eventBudget.format.ts` | `getItemDue`, `summarizeBudget`, `selectCategoryItems` |
| `src/features/events/budget/eventBudget.format.test.ts` | тесты чистой логики |
| `src/features/events/budget/server/eventBudget.validation.ts` | парсеры входных данных |
| `src/features/events/budget/server/eventBudget.validation.test.ts` | тесты парсеров |
| `src/features/events/budget/server/eventBudget.mapper.ts` | Prisma-запись → доменный тип |
| `src/features/events/budget/server/eventBudget.repository.ts` | запросы Prisma |
| `src/features/events/budget/server/eventBudget.service.ts` | сценарии + инвариант `paid <= cost` |
| `src/features/events/budget/server/eventBudget.service.test.ts` | тесты сценариев |
| `src/app/api/events/[id]/budget/categories/route.ts` | `GET`, `POST` категорий |
| `src/app/api/events/[id]/budget/items/route.ts` | `POST` статьи |
| `src/app/api/events/[id]/budget/items/[itemId]/route.ts` | `PATCH` статьи |
| `src/features/events/budget/BudgetSummary.tsx` | три плитки сводки |
| `src/features/events/budget/BudgetCategoryRail.tsx` | рельса категорий и мобильный select |
| `src/features/events/budget/BudgetItemRow.tsx` | строка таблицы и мобильный аккордеон |
| `src/features/events/budget/BudgetItemModal.tsx` | модалка добавления и правки статьи |
| `src/features/events/budget/BudgetCategoryModal.tsx` | модалка добавления категории |
| `src/features/events/budget/EventBudgetPage.tsx` | состояние и мутации |
| `src/features/events/budget/EventBudgetPage.module.css` | стили экрана |
| `src/app/event/[id]/budget/page.tsx` | серверный роут |

### Ветка 3 — `feature/event-timing`

| Файл | Ответственность |
| --- | --- |
| `prisma/schema.prisma` | `EventTimeline`, `EventTimelineEntry` |
| `src/features/events/timing/eventTiming.types.ts` | доменные типы фичи |
| `src/features/events/timing/eventTiming.data.ts` | словарь ролей, тайминг по умолчанию |
| `src/features/events/timing/eventTiming.format.ts` | `formatTimeRange`, `sortEntries`, `compareTimes` |
| `src/features/events/timing/eventTiming.format.test.ts` | тесты чистой логики |
| `src/features/events/timing/server/eventTiming.validation.ts` | парсеры, `parseTimeInput` |
| `src/features/events/timing/server/eventTiming.validation.test.ts` | тесты парсеров |
| `src/features/events/timing/server/eventTiming.mapper.ts` | Prisma-запись → доменный тип |
| `src/features/events/timing/server/eventTiming.repository.ts` | запросы Prisma |
| `src/features/events/timing/server/eventTiming.service.ts` | сценарии + инвариант времён |
| `src/features/events/timing/server/eventTiming.service.test.ts` | тесты сценариев |
| `src/app/api/events/[id]/timing/timelines/route.ts` | `GET`, `POST` таймингов |
| `src/app/api/events/[id]/timing/entries/route.ts` | `POST` события |
| `src/app/api/events/[id]/timing/entries/[entryId]/route.ts` | `PATCH` события |
| `src/features/events/timing/ParticipantChips.tsx` | чипы участников |
| `src/features/events/timing/TimingToolbar.tsx` | селектор тайминга и кнопки |
| `src/features/events/timing/TimingEntryRow.tsx` | строка и мобильный аккордеон |
| `src/features/events/timing/TimingEntryModal.tsx` | модалка правки события |
| `src/features/events/timing/TimingCommentModal.tsx` | модалка комментария |
| `src/features/events/timing/EventTimingPage.tsx` | состояние и мутации |
| `src/features/events/timing/EventTimingPage.module.css` | стили экрана |
| `src/app/event/[id]/timing/page.tsx` | серверный роут |

---

# Ветка 1 — `feature/event-workspace-chrome`

- [ ] **Ветка:** `git checkout client && git pull && git checkout -b feature/event-workspace-chrome`

## Task 1: Определения вкладок воркспейса

**Files:**
- Create: `src/features/events/workspace/workspaceTabs.ts`
- Test: `src/features/events/workspace/workspaceTabs.test.ts`

**Interfaces:**
- Consumes: ничего
- Produces: `WorkspaceTabKey`, `WorkspaceTab`, `WORKSPACE_TABS`, `buildWorkspaceTabs(eventId): WorkspaceTab[]`, `getWorkspaceTabLabels(): string[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/events/workspace/workspaceTabs.test.ts
import { describe, expect, it } from 'vitest'
import { buildWorkspaceTabs, getWorkspaceTabLabels, WORKSPACE_TABS } from './workspaceTabs'

describe('buildWorkspaceTabs', () => {
  it('подставляет eventId во все ссылки мероприятия', () => {
    const tabs = buildWorkspaceTabs('evt-1')
    const byKey = Object.fromEntries(tabs.map((tab) => [tab.key, tab.href]))

    expect(byKey.wedding).toBe('/event/evt-1')
    expect(byKey.tasks).toBe('/event/evt-1/tasks')
    expect(byKey.guests).toBe('/event/evt-1/guests')
    expect(byKey.timing).toBe('/event/evt-1/timing')
    expect(byKey.budget).toBe('/event/evt-1/budget')
  })

  it('ведёт избранное в дашборд, а не в мероприятие', () => {
    const tabs = buildWorkspaceTabs('evt-1')
    expect(tabs.find((tab) => tab.key === 'favorites')?.href).toBe('/dashboard/favorites')
  })

  it('оставляет рассадку заглушкой: макета нет', () => {
    const tabs = buildWorkspaceTabs('evt-1')
    const seating = tabs.find((tab) => tab.key === 'seating')

    expect(seating?.href).toBe('#')
    expect(seating?.isPlaceholder).toBe(true)
  })

  it('сохраняет порядок вкладок из макета', () => {
    expect(buildWorkspaceTabs('evt-1').map((tab) => tab.key)).toEqual([
      'wedding',
      'favorites',
      'tasks',
      'guests',
      'seating',
      'timing',
      'budget',
    ])
  })

  it('не теряет вкладки при построении', () => {
    expect(buildWorkspaceTabs('evt-1')).toHaveLength(WORKSPACE_TABS.length)
  })
})

describe('getWorkspaceTabLabels', () => {
  it('отдаёт метки в порядке макета', () => {
    expect(getWorkspaceTabLabels()).toEqual([
      'Моя свадьба',
      'Избранное',
      'Список задач',
      'Список гостей',
      'Рассадка',
      'Тайминг',
      'Бюджет',
    ])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/events/workspace/workspaceTabs.test.ts`
Expected: FAIL — `Failed to resolve import "./workspaceTabs"`

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/events/workspace/workspaceTabs.ts
export type WorkspaceTabKey = 'wedding' | 'favorites' | 'tasks' | 'guests' | 'seating' | 'timing' | 'budget'

export type WorkspaceTab = {
  key: WorkspaceTabKey
  label: string
  href: string
  isPlaceholder: boolean
}

type WorkspaceTabDefinition = {
  key: WorkspaceTabKey
  label: string
  buildHref(eventId: string): string
}

export const WORKSPACE_TABS: readonly WorkspaceTabDefinition[] = [
  { key: 'wedding', label: 'Моя свадьба', buildHref: (eventId) => `/event/${eventId}` },
  { key: 'favorites', label: 'Избранное', buildHref: () => '/dashboard/favorites' },
  { key: 'tasks', label: 'Список задач', buildHref: (eventId) => `/event/${eventId}/tasks` },
  { key: 'guests', label: 'Список гостей', buildHref: (eventId) => `/event/${eventId}/guests` },
  { key: 'seating', label: 'Рассадка', buildHref: () => '#' },
  { key: 'timing', label: 'Тайминг', buildHref: (eventId) => `/event/${eventId}/timing` },
  { key: 'budget', label: 'Бюджет', buildHref: (eventId) => `/event/${eventId}/budget` },
]

export function buildWorkspaceTabs(eventId: string): WorkspaceTab[] {
  return WORKSPACE_TABS.map((tab) => {
    const href = tab.buildHref(eventId)
    return { key: tab.key, label: tab.label, href, isPlaceholder: href === '#' }
  })
}

export function getWorkspaceTabLabels(): string[] {
  return WORKSPACE_TABS.map((tab) => tab.label)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/events/workspace/workspaceTabs.test.ts`
Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/features/events/workspace/workspaceTabs.ts src/features/events/workspace/workspaceTabs.test.ts
git commit -m "feat(web): add event workspace tab definitions"
```

## Task 2: Компоненты чрома

**Files:**
- Create: `src/features/events/workspace/EventWorkspaceHeader.tsx`
- Create: `src/features/events/workspace/EventWorkspaceNav.tsx`
- Create: `src/features/events/workspace/EventWorkspaceFooter.tsx`
- Create: `src/features/events/workspace/EventWorkspaceChrome.tsx`
- Create: `src/features/events/workspace/EventWorkspaceChrome.module.css`

**Interfaces:**
- Consumes: `buildWorkspaceTabs`, `WorkspaceTabKey` из Task 1
- Produces: `<EventWorkspaceChrome eventId active breadcrumbs mobileTitle mobileBackHref>` c `children`; CSS-класс `styles.content` для контентной обёртки

- [ ] **Step 1: Перенести общие селекторы в CSS-модуль чрома**

Скопировать в `EventWorkspaceChrome.module.css` из `src/features/events/tasks/EventTasksPage.module.css` селекторы: `.page`, `.topbar`, `.topbarInner`, `.logo`, `.mainNav`, `.headerActions`, `.goldButton`, `.currency`, `.iconButton`, `.badge`, `.user`, `.user::before`, `.menuButton`, `.menuButton span`, `.workspaceNav`, `.workspaceNav .activeTab`, `.content`, `.breadcrumbs`, `.mobileContext`, `.footer`, `.footerInner`, `.footerLogo`, `.footerLinks`, `.footerPills`, `.footerPill`, `.age`, `.copyright`.

Вместе с ними перенести относящиеся к ним правила из медиа-запросов `@media (max-width: 1200px)` (строки 498-513) и `@media (max-width: 760px)` (строки 515-571, 735-758): `.topbarInner`, `.content`, `.mainNav`, `.topbar`, `.logo`, `.goldButton`, `.currency`, `.user`, `.workspaceNav`, `.headerActions`, `.headerActions .iconButton:nth-of-type(3)`, `.menuButton`, `.breadcrumbs`, `.mobileContext`, `.mobileContext a`, `.footerInner`, `.footerLinks`, `.footerPill`.

- [ ] **Step 2: Написать `EventWorkspaceHeader.tsx`**

Разметка один в один с `EventTasksPage.tsx:16-51`: `<header className={styles.topbar}>` → `.topbarInner` → лого `I GO WED`, `<nav className={styles.mainNav}>` с пятью ссылками (Главная, Площадки, Каталог, Фото, Блог), `.headerActions` с золотой кнопкой «Создать мероприятие», `RUB⌄`, `RU⌄`, тремя иконочными кнопками (Поиск, Уведомления с бейджем `123`, Сообщения с бейджем `1`), именем `Анна` и бургером из трёх `<span />`.

- [ ] **Step 3: Написать `EventWorkspaceNav.tsx`**

```tsx
import Link from 'next/link'
import { buildWorkspaceTabs, type WorkspaceTabKey } from './workspaceTabs'
import styles from './EventWorkspaceChrome.module.css'

export function EventWorkspaceNav({ eventId, active }: { eventId: string; active: WorkspaceTabKey }) {
  return (
    <nav className={styles.workspaceNav} aria-label="Разделы мероприятия">
      {buildWorkspaceTabs(eventId).map((tab) => (
        <Link
          className={tab.key === active ? styles.activeTab : undefined}
          href={tab.href}
          key={tab.key}
          aria-current={tab.key === active ? 'page' : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
```

- [ ] **Step 4: Написать `EventWorkspaceFooter.tsx`**

Разметка один в один с `EventTasksPage.tsx:68-92`.

- [ ] **Step 5: Написать `EventWorkspaceChrome.tsx`**

```tsx
import Link from 'next/link'
import type { ReactNode } from 'react'
import { EventWorkspaceFooter } from './EventWorkspaceFooter'
import { EventWorkspaceHeader } from './EventWorkspaceHeader'
import { EventWorkspaceNav } from './EventWorkspaceNav'
import type { WorkspaceTabKey } from './workspaceTabs'
import styles from './EventWorkspaceChrome.module.css'

type EventWorkspaceChromeProps = {
  eventId: string
  active: WorkspaceTabKey
  breadcrumbs: string
  mobileTitle: string
  mobileBackHref: string
  children: ReactNode
}

export function EventWorkspaceChrome({
  eventId,
  active,
  breadcrumbs,
  mobileTitle,
  mobileBackHref,
  children,
}: EventWorkspaceChromeProps) {
  return (
    <div className={styles.page}>
      <EventWorkspaceHeader />
      <EventWorkspaceNav active={active} eventId={eventId} />
      <main className={styles.content}>
        <div className={styles.mobileContext}>
          <Link href={mobileBackHref} aria-label="Назад">
            ‹
          </Link>
          <span>{mobileTitle}</span>
        </div>
        <div className={styles.breadcrumbs}>{breadcrumbs}</div>
        {children}
      </main>
      <EventWorkspaceFooter />
    </div>
  )
}
```

- [ ] **Step 6: Проверить сборку**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: без ошибок в файлах `src/features/events/workspace/`

- [ ] **Step 7: Commit**

```bash
git add src/features/events/workspace/
git commit -m "feat(web): add shared event workspace chrome"
```

## Task 3: Перевод страниц задач и гостей на общий чром

**Files:**
- Modify: `src/features/events/tasks/EventTasksPage.tsx`
- Modify: `src/features/events/tasks/EventTasksPage.module.css`
- Modify: `src/features/events/guests/EventGuestsPage.tsx`
- Modify: `src/features/events/guests/EventGuestsPage.module.css`
- Modify: `src/features/events/create/createEvent.constants.ts`

**Interfaces:**
- Consumes: `EventWorkspaceChrome` из Task 2, `getWorkspaceTabLabels` из Task 1
- Produces: ничего нового

- [ ] **Step 1: Удалить локальные `Header` и `Footer` из обеих страниц**

Из `EventTasksPage.tsx` удалить функции `Header` (строки 13-65) и `Footer` (строки 67-93). То же самое в `EventGuestsPage.tsx`. Внешнюю разметку страницы заменить на:

```tsx
<EventWorkspaceChrome
  eventId={eventId}
  active="tasks"
  breadcrumbs="Главная › Мероприятия › Список задач"
  mobileTitle="Список задач"
  mobileBackHref={`/event/${eventId}`}
>
  {/* существующий контент страницы без .page, .content, .breadcrumbs, .mobileContext */}
</EventWorkspaceChrome>
```

Для гостей — `active="guests"`, заголовки «Список гостей». Точные тексты хлебных крошек и мобильного заголовка взять из текущей разметки этих страниц, чтобы ничего не поменялось визуально.

- [ ] **Step 2: Вычистить перенесённые селекторы из CSS-модулей страниц**

Удалить из `EventTasksPage.module.css` и `EventGuestsPage.module.css` все селекторы, перечисленные в Task 2 Step 1, включая их правила внутри медиа-запросов. Оставить всё, что относится к содержимому страницы.

- [ ] **Step 3: Убрать расхождение в метках вкладок**

`src/features/events/create/createEvent.constants.ts:1` сейчас:

```ts
export const eventWorkspaceTabs = ['Моя свадьба', 'Избранное', 'Список дел', 'Список гостей', 'Рассадка', 'Тайминг', 'Бюджет']
```

Заменить на:

```ts
import { getWorkspaceTabLabels } from '@/features/events/workspace/workspaceTabs'

export const eventWorkspaceTabs = getWorkspaceTabLabels()
```

- [ ] **Step 4: Прогнать полную проверку**

Run: `npm run lint && npm run build && npm run test`
Expected: lint без ошибок, сборка успешна, 15 файлов / 52 теста web + 5 файлов / 11 тестов api, плюс новый `workspaceTabs.test.ts` — итого 16 файлов / 58 тестов web

- [ ] **Step 5: Саморевью**

Пройтись по диффу: не осталось ли дублей селекторов в CSS страниц, не потерялся ли `aria-label` у навигаций, совпадают ли хлебные крошки с прежними. Найденное исправить и перепрогнать Step 4.

- [ ] **Step 6: Commit и PR**

```bash
git add -A
git commit -m "refactor(web): extract event workspace chrome"
git push -u origin feature/event-workspace-chrome
gh pr create --base client --title "refactor(web): extract event workspace chrome" --body "Выносит продублированные хедер, футер и навбар воркспейса из страниц задач и гостей в общий модуль. Метки вкладок сведены к одному источнику."
```

- [ ] **Step 7: Дождаться CI и влить**

Run: `gh pr checks --watch`
Expected: все проверки зелёные. Затем `gh pr merge --squash --delete-branch`.

---

# Ветка 2 — `feature/event-budget`

- [ ] **Ветка:** `git checkout client && git pull && git checkout -b feature/event-budget`

## Task 4: Модуль валют

**Files:**
- Create: `src/lib/currency/currency.types.ts`
- Create: `src/lib/currency/currency.rates.ts`
- Create: `src/lib/currency/currency.convert.ts`
- Create: `src/lib/currency/currency.format.ts`
- Test: `src/lib/currency/currency.convert.test.ts`
- Test: `src/lib/currency/currency.format.test.ts`

**Interfaces:**
- Consumes: ничего
- Produces: `CurrencyCode`, `Money`, `CURRENCY_CODES`, `isCurrencyCode(value): value is CurrencyCode`, `convertMoney(money, to): Money`, `sumMoney(list, to): Money`, `formatMoney(money): string`, `formatAmount(amount): string`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/currency/currency.convert.test.ts
import { describe, expect, it } from 'vitest'
import { convertMoney, sumMoney } from './currency.convert'

describe('convertMoney', () => {
  it('не меняет сумму при конвертации в ту же валюту', () => {
    expect(convertMoney({ amount: 5000, currency: 'BYN' }, 'BYN')).toEqual({ amount: 5000, currency: 'BYN' })
  })

  it('конвертирует между валютами через базу', () => {
    const converted = convertMoney({ amount: 100, currency: 'USD' }, 'BYN')
    expect(converted.currency).toBe('BYN')
    expect(converted.amount).toBeGreaterThan(100)
  })

  it('округляет до целых единиц', () => {
    expect(Number.isInteger(convertMoney({ amount: 333, currency: 'RUB' }, 'USD').amount)).toBe(true)
  })

  it('оставляет ноль нулём', () => {
    expect(convertMoney({ amount: 0, currency: 'EUR' }, 'BYN').amount).toBe(0)
  })
})

describe('sumMoney', () => {
  it('складывает суммы в одной валюте без потерь', () => {
    const total = sumMoney(
      [
        { amount: 5000, currency: 'BYN' },
        { amount: 1000, currency: 'BYN' },
      ],
      'BYN',
    )
    expect(total).toEqual({ amount: 6000, currency: 'BYN' })
  })

  it('приводит смешанные валюты к целевой', () => {
    const total = sumMoney(
      [
        { amount: 100, currency: 'BYN' },
        { amount: 100, currency: 'USD' },
      ],
      'BYN',
    )
    expect(total.currency).toBe('BYN')
    expect(total.amount).toBeGreaterThan(200)
  })

  it('отдаёт ноль в целевой валюте для пустого списка', () => {
    expect(sumMoney([], 'USD')).toEqual({ amount: 0, currency: 'USD' })
  })
})
```

```ts
// src/lib/currency/currency.format.test.ts
import { describe, expect, it } from 'vitest'
import { formatAmount, formatMoney } from './currency.format'

describe('formatAmount', () => {
  it('разделяет разряды неразрывным пробелом', () => {
    expect(formatAmount(15000)).toBe('15 000')
  })

  it('не трогает числа меньше тысячи', () => {
    expect(formatAmount(500)).toBe('500')
  })

  it('форматирует ноль', () => {
    expect(formatAmount(0)).toBe('0')
  })
})

describe('formatMoney', () => {
  it('ставит код валюты после суммы', () => {
    expect(formatMoney({ amount: 15000, currency: 'BYN' })).toBe('15 000 BYN')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/currency/`
Expected: FAIL — `Failed to resolve import "./currency.convert"`

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/currency/currency.types.ts
export const CURRENCY_CODES = ['BYN', 'RUB', 'USD', 'EUR'] as const

export type CurrencyCode = (typeof CURRENCY_CODES)[number]

export type Money = {
  amount: number
  currency: CurrencyCode
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && (CURRENCY_CODES as readonly string[]).includes(value)
}
```

```ts
// src/lib/currency/currency.rates.ts
import type { CurrencyCode } from './currency.types'

/**
 * Курсы к базовой валюте: сколько единиц валюты в одном долларе.
 * Статическая таблица — живого источника курсов в проекте пока нет.
 * При появлении провайдера меняется только этот файл.
 */
export const RATE_BASE: CurrencyCode = 'USD'

export const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  BYN: 3.27,
  RUB: 92.5,
  EUR: 0.92,
}

export const RATES_UPDATED_AT = '2026-07-23'
```

```ts
// src/lib/currency/currency.convert.ts
import { RATES } from './currency.rates'
import type { CurrencyCode, Money } from './currency.types'

export function convertMoney(money: Money, to: CurrencyCode): Money {
  if (money.currency === to) {
    return { amount: money.amount, currency: to }
  }

  const inBase = money.amount / RATES[money.currency]
  return { amount: Math.round(inBase * RATES[to]), currency: to }
}

export function sumMoney(list: readonly Money[], to: CurrencyCode): Money {
  const amount = list.reduce((total, money) => total + convertMoney(money, to).amount, 0)
  return { amount, currency: to }
}
```

```ts
// src/lib/currency/currency.format.ts
import type { Money } from './currency.types'

const amountFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

export function formatAmount(amount: number): string {
  return amountFormatter.format(amount).replace(/\s/g, ' ')
}

export function formatMoney(money: Money): string {
  return `${formatAmount(money.amount)} ${money.currency}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/currency/`
Expected: PASS — 2 файла, 11 тестов

- [ ] **Step 5: Commit**

```bash
git add src/lib/currency/
git commit -m "feat(web): add currency conversion module"
```

## Task 5: Prisma-модели бюджета

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Consumes: ничего
- Produces: модели `EventBudgetCategory`, `EventBudgetItem`; поле `Event.budgetCurrency`

- [ ] **Step 1: Добавить поле и связь в `Event`**

В модель `Event` после `budgetMax Int?` добавить:

```prisma
  budgetCurrency String @default("BYN")
```

и в блок связей после `guests EventGuest[]`:

```prisma
  budgetCategories EventBudgetCategory[]
```

- [ ] **Step 2: Добавить модели после `EventGuest`**

```prisma
model EventBudgetCategory {
  id        String   @id @default(cuid())
  eventId   String
  title     String
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  event Event             @relation(fields: [eventId], references: [id], onDelete: Cascade)
  items EventBudgetItem[]

  @@index([eventId])
}

model EventBudgetItem {
  id         String   @id @default(cuid())
  categoryId String
  title      String
  cost       Int      @default(0)
  paid       Int      @default(0)
  currency   String   @default("BYN")
  order      Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  category EventBudgetCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([categoryId])
}
```

- [ ] **Step 3: Сгенерировать клиент**

Run: `npm run db:generate`
Expected: `Generated Prisma Client ... to ./src/generated/prisma`

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(api): add event budget schema"
```

## Task 6: Типы, данные и чистая логика бюджета

**Files:**
- Create: `src/features/events/budget/eventBudget.types.ts`
- Create: `src/features/events/budget/eventBudget.data.ts`
- Create: `src/features/events/budget/eventBudget.format.ts`
- Test: `src/features/events/budget/eventBudget.format.test.ts`

**Interfaces:**
- Consumes: `CurrencyCode`, `Money`, `sumMoney` из Task 4
- Produces: `BudgetItem`, `BudgetCategory`, `BudgetSummaryTotals`, `ALL_CATEGORIES_KEY`, `DEFAULT_BUDGET_CATEGORIES`, `getItemDue(item): number`, `selectCategoryItems(categories, categoryId): BudgetItem[]`, `summarizeBudget(items, currency): BudgetSummaryTotals`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/events/budget/eventBudget.format.test.ts
import { describe, expect, it } from 'vitest'
import { ALL_CATEGORIES_KEY } from './eventBudget.data'
import { getItemDue, selectCategoryItems, summarizeBudget } from './eventBudget.format'
import type { BudgetCategory, BudgetItem } from './eventBudget.types'

function item(overrides: Partial<BudgetItem> = {}): BudgetItem {
  return { id: 'i1', title: 'Кольца', cost: 5000, paid: 1000, currency: 'BYN', order: 0, ...overrides }
}

const categories: BudgetCategory[] = [
  { id: 'c1', title: 'Невеста', order: 0, items: [item({ id: 'i1' })] },
  { id: 'c2', title: 'Жених', order: 1, items: [item({ id: 'i2', cost: 3000, paid: 3000 })] },
]

describe('getItemDue', () => {
  it('вычитает оплаченное из стоимости', () => {
    expect(getItemDue(item({ cost: 5000, paid: 1000 }))).toBe(4000)
  })

  it('отдаёт ноль для полностью оплаченной статьи', () => {
    expect(getItemDue(item({ cost: 3000, paid: 3000 }))).toBe(0)
  })
})

describe('selectCategoryItems', () => {
  it('собирает все статьи для виртуальной категории «общий»', () => {
    expect(selectCategoryItems(categories, ALL_CATEGORIES_KEY).map((entry) => entry.id)).toEqual(['i1', 'i2'])
  })

  it('отдаёт статьи одной категории', () => {
    expect(selectCategoryItems(categories, 'c2').map((entry) => entry.id)).toEqual(['i2'])
  })

  it('отдаёт пустой список для неизвестной категории', () => {
    expect(selectCategoryItems(categories, 'нет-такой')).toEqual([])
  })
})

describe('summarizeBudget', () => {
  it('считает общий бюджет, оплаченное и остаток', () => {
    const totals = summarizeBudget([item({ cost: 5000, paid: 1000 }), item({ id: 'i2', cost: 3000, paid: 500 })], 'BYN')

    expect(totals.total).toEqual({ amount: 8000, currency: 'BYN' })
    expect(totals.paid).toEqual({ amount: 1500, currency: 'BYN' })
    expect(totals.due).toEqual({ amount: 6500, currency: 'BYN' })
  })

  it('приводит статьи в разных валютах к валюте сводки', () => {
    const totals = summarizeBudget([item({ cost: 100, paid: 0, currency: 'BYN' }), item({ id: 'i2', cost: 100, paid: 0, currency: 'USD' })], 'BYN')

    expect(totals.total.currency).toBe('BYN')
    expect(totals.total.amount).toBeGreaterThan(200)
  })

  it('отдаёт нули для пустого бюджета', () => {
    const totals = summarizeBudget([], 'BYN')

    expect(totals.total.amount).toBe(0)
    expect(totals.paid.amount).toBe(0)
    expect(totals.due.amount).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/events/budget/`
Expected: FAIL — `Failed to resolve import "./eventBudget.data"`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/events/budget/eventBudget.types.ts
import type { CurrencyCode, Money } from '@/lib/currency/currency.types'

export type BudgetItem = {
  id: string
  title: string
  cost: number
  paid: number
  currency: CurrencyCode
  order: number
}

export type BudgetCategory = {
  id: string
  title: string
  order: number
  items: BudgetItem[]
}

export type BudgetSummaryTotals = {
  total: Money
  paid: Money
  due: Money
}
```

```ts
// src/features/events/budget/eventBudget.data.ts
export const ALL_CATEGORIES_KEY = 'all'

export const ALL_CATEGORIES_TITLE = 'Общий'

export const DEFAULT_BUDGET_CATEGORIES = [
  { title: 'Невеста', order: 0 },
  { title: 'Жених', order: 1 },
  { title: 'Шоу-программа', order: 2 },
  { title: 'Декор', order: 3 },
] as const

export const budgetFieldLabels = {
  title: 'Статья расходов',
  cost: 'Стоимость',
  paid: 'Оплачено',
  due: 'К оплате',
  currency: 'Валюта',
} as const
```

```ts
// src/features/events/budget/eventBudget.format.ts
import { sumMoney } from '@/lib/currency/currency.convert'
import type { CurrencyCode } from '@/lib/currency/currency.types'
import { ALL_CATEGORIES_KEY } from './eventBudget.data'
import type { BudgetCategory, BudgetItem, BudgetSummaryTotals } from './eventBudget.types'

export function getItemDue(item: BudgetItem): number {
  return item.cost - item.paid
}

export function selectCategoryItems(categories: readonly BudgetCategory[], categoryId: string): BudgetItem[] {
  if (categoryId === ALL_CATEGORIES_KEY) {
    return categories.flatMap((category) => category.items)
  }

  return categories.find((category) => category.id === categoryId)?.items ?? []
}

export function summarizeBudget(items: readonly BudgetItem[], currency: CurrencyCode): BudgetSummaryTotals {
  return {
    total: sumMoney(
      items.map((item) => ({ amount: item.cost, currency: item.currency })),
      currency,
    ),
    paid: sumMoney(
      items.map((item) => ({ amount: item.paid, currency: item.currency })),
      currency,
    ),
    due: sumMoney(
      items.map((item) => ({ amount: getItemDue(item), currency: item.currency })),
      currency,
    ),
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/events/budget/`
Expected: PASS — 8 тестов

- [ ] **Step 5: Commit**

```bash
git add src/features/events/budget/
git commit -m "feat(web): add event budget domain logic"
```

## Task 7: Валидация бюджета

**Files:**
- Create: `src/features/events/budget/server/eventBudget.validation.ts`
- Test: `src/features/events/budget/server/eventBudget.validation.test.ts`

**Interfaces:**
- Consumes: `isCurrencyCode`, `CurrencyCode` из Task 4
- Produces: `EventBudgetValidationError`, `CreateCategoryInput`, `CreateItemInput`, `UpdateItemInput`, `parseCreateCategoryInput`, `parseCreateItemInput`, `parseUpdateItemInput`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/events/budget/server/eventBudget.validation.test.ts
import { describe, expect, it } from 'vitest'
import { EventBudgetValidationError, parseCreateCategoryInput, parseCreateItemInput, parseUpdateItemInput } from './eventBudget.validation'

describe('parseCreateCategoryInput', () => {
  it('нормализует пробелы в названии', () => {
    expect(parseCreateCategoryInput({ title: '  Шоу   программа ' })).toEqual({ title: 'Шоу программа' })
  })

  it('отклоняет пустое название', () => {
    expect(() => parseCreateCategoryInput({ title: '   ' })).toThrow(EventBudgetValidationError)
  })

  it('отклоняет не-объект', () => {
    expect(() => parseCreateCategoryInput(null)).toThrow(EventBudgetValidationError)
  })
})

describe('parseCreateItemInput', () => {
  it('разбирает корректную статью', () => {
    expect(parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: 5000, paid: 1000, currency: 'BYN' })).toEqual({
      categoryId: 'c1',
      title: 'Кольца',
      cost: 5000,
      paid: 1000,
      currency: 'BYN',
    })
  })

  it('подставляет нули и валюту по умолчанию', () => {
    expect(parseCreateItemInput({ categoryId: 'c1', title: 'Кольца' })).toEqual({
      categoryId: 'c1',
      title: 'Кольца',
      cost: 0,
      paid: 0,
      currency: 'BYN',
    })
  })

  it('требует категорию', () => {
    expect(() => parseCreateItemInput({ title: 'Кольца' })).toThrow('Выберите категорию расходов')
  })

  it('требует название', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: '  ' })).toThrow('Название статьи обязательно')
  })

  it('отклоняет отрицательную стоимость', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: -1 })).toThrow(EventBudgetValidationError)
  })

  it('отклоняет дробные суммы', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: 10.5 })).toThrow(EventBudgetValidationError)
  })

  it('отклоняет оплату больше стоимости', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', cost: 100, paid: 200 })).toThrow(
      'Оплачено не может превышать стоимость',
    )
  })

  it('отклоняет неизвестную валюту', () => {
    expect(() => parseCreateItemInput({ categoryId: 'c1', title: 'Кольца', currency: 'BTC' })).toThrow(EventBudgetValidationError)
  })
})

describe('parseUpdateItemInput', () => {
  it('принимает частичное обновление', () => {
    expect(parseUpdateItemInput({ paid: 2000 })).toEqual({ paid: 2000 })
  })

  it('не проверяет соотношение сумм в отрыве от сохранённой статьи', () => {
    expect(parseUpdateItemInput({ paid: 999999 })).toEqual({ paid: 999999 })
  })

  it('отклоняет пустой патч', () => {
    expect(() => parseUpdateItemInput({})).toThrow('Нет данных для обновления')
  })

  it('отклоняет пустое название', () => {
    expect(() => parseUpdateItemInput({ title: '  ' })).toThrow(EventBudgetValidationError)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/events/budget/server/`
Expected: FAIL — `Failed to resolve import "./eventBudget.validation"`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/events/budget/server/eventBudget.validation.ts
import { isCurrencyCode, type CurrencyCode } from '@/lib/currency/currency.types'

export class EventBudgetValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventBudgetValidationError'
  }
}

export type CreateCategoryInput = {
  title: string
}

export type CreateItemInput = {
  categoryId: string
  title: string
  cost: number
  paid: number
  currency: CurrencyCode
}

export type UpdateItemInput = {
  title?: string
  cost?: number
  paid?: number
  currency?: CurrencyCode
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

function parseAmount(value: unknown, field: string): number {
  if (value === undefined || value === null || value === '') return 0

  const amount = typeof value === 'string' ? Number(value.replace(/\s/g, '')) : value
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 0) {
    throw new EventBudgetValidationError(`Поле «${field}» должно быть целым неотрицательным числом`)
  }

  return amount
}

function parseCurrency(value: unknown): CurrencyCode {
  if (value === undefined || value === null || value === '') return 'BYN'
  if (!isCurrencyCode(value)) {
    throw new EventBudgetValidationError('Выберите валюту из списка')
  }

  return value
}

export function parseCreateCategoryInput(raw: unknown): CreateCategoryInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventBudgetValidationError('Некорректные данные категории')
  }

  const title = cleanString((raw as Record<string, unknown>).title)
  if (!title) {
    throw new EventBudgetValidationError('Название категории обязательно')
  }

  return { title }
}

export function parseCreateItemInput(raw: unknown): CreateItemInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventBudgetValidationError('Некорректные данные статьи расходов')
  }

  const data = raw as Record<string, unknown>
  const categoryId = cleanString(data.categoryId)
  const title = cleanString(data.title)

  if (!categoryId) {
    throw new EventBudgetValidationError('Выберите категорию расходов')
  }

  if (!title) {
    throw new EventBudgetValidationError('Название статьи обязательно')
  }

  const cost = parseAmount(data.cost, 'Стоимость')
  const paid = parseAmount(data.paid, 'Оплачено')

  if (paid > cost) {
    throw new EventBudgetValidationError('Оплачено не может превышать стоимость')
  }

  return { categoryId, title, cost, paid, currency: parseCurrency(data.currency) }
}

export function parseUpdateItemInput(raw: unknown): UpdateItemInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventBudgetValidationError('Некорректные данные статьи расходов')
  }

  const data = raw as Record<string, unknown>
  const input: UpdateItemInput = {}

  if ('title' in data) {
    const title = cleanString(data.title)
    if (!title) throw new EventBudgetValidationError('Название статьи обязательно')
    input.title = title
  }

  if ('cost' in data) input.cost = parseAmount(data.cost, 'Стоимость')
  if ('paid' in data) input.paid = parseAmount(data.paid, 'Оплачено')
  if ('currency' in data) input.currency = parseCurrency(data.currency)

  if (Object.keys(input).length === 0) {
    throw new EventBudgetValidationError('Нет данных для обновления')
  }

  return input
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/events/budget/server/`
Expected: PASS — 15 тестов

- [ ] **Step 5: Commit**

```bash
git add src/features/events/budget/server/
git commit -m "feat(web): add event budget validation"
```

## Task 8: Маппер, репозиторий и сервис бюджета

**Files:**
- Create: `src/features/events/budget/server/eventBudget.mapper.ts`
- Create: `src/features/events/budget/server/eventBudget.repository.ts`
- Create: `src/features/events/budget/server/eventBudget.service.ts`
- Test: `src/features/events/budget/server/eventBudget.service.test.ts`

**Interfaces:**
- Consumes: парсеры из Task 7, типы из Task 6
- Produces: `mapBudgetItemRecord`, `mapBudgetCategoryRecord`, `eventBudgetRepository`, `listBudgetCategoriesForEvent`, `createBudgetCategoryForEvent`, `createBudgetItemForEvent`, `updateBudgetItemForEvent`, `isEventBudgetError`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/events/budget/server/eventBudget.service.test.ts
import { describe, expect, it, vi } from 'vitest'
import {
  createBudgetItemForEvent,
  isEventBudgetError,
  listBudgetCategoriesForEvent,
  updateBudgetItemForEvent,
} from './eventBudget.service'
import { EventBudgetValidationError } from './eventBudget.validation'

function categoryRecord(overrides = {}) {
  return { id: 'c1', title: 'Невеста', order: 0, items: [], ...overrides }
}

function itemRecord(overrides = {}) {
  return { id: 'i1', title: 'Кольца', cost: 5000, paid: 1000, currency: 'BYN', order: 0, ...overrides }
}

function deps(overrides = {}) {
  return {
    listCategories: vi.fn().mockResolvedValue([categoryRecord()]),
    seedDefaultCategories: vi.fn().mockResolvedValue([categoryRecord()]),
    createCategory: vi.fn().mockResolvedValue(categoryRecord()),
    createItem: vi.fn().mockResolvedValue(itemRecord()),
    updateItem: vi.fn().mockResolvedValue({ count: 1 }),
    findItem: vi.fn().mockResolvedValue(itemRecord()),
    ...overrides,
  }
}

describe('listBudgetCategoriesForEvent', () => {
  it('отдаёт пустой список без пользователя', async () => {
    expect(await listBudgetCategoriesForEvent('', 'evt-1', deps())).toEqual([])
  })

  it('не сеет категории, если они уже есть', async () => {
    const dependencies = deps()
    await listBudgetCategoriesForEvent('u1', 'evt-1', dependencies)

    expect(dependencies.seedDefaultCategories).not.toHaveBeenCalled()
  })

  it('сеет категории по умолчанию при первом открытии', async () => {
    const dependencies = deps({ listCategories: vi.fn().mockResolvedValue([]) })
    await listBudgetCategoriesForEvent('u1', 'evt-1', dependencies)

    expect(dependencies.seedDefaultCategories).toHaveBeenCalledWith('u1', 'evt-1')
  })
})

describe('createBudgetItemForEvent', () => {
  it('создаёт статью и отдаёт доменный тип', async () => {
    const item = await createBudgetItemForEvent('u1', 'evt-1', { categoryId: 'c1', title: 'Кольца', cost: 5000, paid: 1000 }, deps())

    expect(item.id).toBe('i1')
    expect(item.currency).toBe('BYN')
  })

  it('падает, если категория чужая или не найдена', async () => {
    const dependencies = deps({ createItem: vi.fn().mockResolvedValue(null) })

    await expect(createBudgetItemForEvent('u1', 'evt-1', { categoryId: 'c9', title: 'Кольца' }, dependencies)).rejects.toThrow(
      EventBudgetValidationError,
    )
  })
})

describe('updateBudgetItemForEvent', () => {
  it('обновляет статью и возвращает свежую запись', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(itemRecord({ paid: 2000 })) })
    const item = await updateBudgetItemForEvent('u1', 'evt-1', 'i1', { paid: 2000 }, dependencies)

    expect(item.paid).toBe(2000)
  })

  it('отклоняет оплату больше сохранённой стоимости', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(itemRecord({ cost: 5000 })) })

    await expect(updateBudgetItemForEvent('u1', 'evt-1', 'i1', { paid: 9000 }, dependencies)).rejects.toThrow(
      'Оплачено не может превышать стоимость',
    )
    expect(dependencies.updateItem).not.toHaveBeenCalled()
  })

  it('проверяет соотношение по слитому состоянию, а не по патчу', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(itemRecord({ cost: 5000, paid: 1000 })) })
    await updateBudgetItemForEvent('u1', 'evt-1', 'i1', { cost: 9000, paid: 9000 }, dependencies)

    expect(dependencies.updateItem).toHaveBeenCalled()
  })

  it('падает на чужой статье', async () => {
    const dependencies = deps({ findItem: vi.fn().mockResolvedValue(null) })

    await expect(updateBudgetItemForEvent('u1', 'evt-1', 'i9', { paid: 10 }, dependencies)).rejects.toThrow(EventBudgetValidationError)
  })
})

describe('isEventBudgetError', () => {
  it('узнаёт ошибку валидации бюджета', () => {
    expect(isEventBudgetError(new EventBudgetValidationError('нет'))).toBe(true)
  })

  it('не путает её с обычной ошибкой', () => {
    expect(isEventBudgetError(new Error('нет'))).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/events/budget/server/eventBudget.service.test.ts`
Expected: FAIL — `Failed to resolve import "./eventBudget.service"`

- [ ] **Step 3: Написать маппер**

```ts
// src/features/events/budget/server/eventBudget.mapper.ts
import { isCurrencyCode } from '@/lib/currency/currency.types'
import type { BudgetCategory, BudgetItem } from '../eventBudget.types'

type BudgetItemRecord = {
  id: string
  title: string
  cost: number
  paid: number
  currency: string
  order: number
}

type BudgetCategoryRecord = {
  id: string
  title: string
  order: number
  items: BudgetItemRecord[]
}

export function mapBudgetItemRecord(item: BudgetItemRecord): BudgetItem {
  return {
    id: item.id,
    title: item.title,
    cost: item.cost,
    paid: item.paid,
    currency: isCurrencyCode(item.currency) ? item.currency : 'BYN',
    order: item.order,
  }
}

export function mapBudgetCategoryRecord(category: BudgetCategoryRecord): BudgetCategory {
  return {
    id: category.id,
    title: category.title,
    order: category.order,
    items: category.items.map(mapBudgetItemRecord),
  }
}
```

- [ ] **Step 4: Написать сервис**

```ts
// src/features/events/budget/server/eventBudget.service.ts
import { mapBudgetCategoryRecord, mapBudgetItemRecord } from './eventBudget.mapper'
import {
  EventBudgetValidationError,
  parseCreateCategoryInput,
  parseCreateItemInput,
  parseUpdateItemInput,
} from './eventBudget.validation'

type EventBudgetDeps = {
  listCategories(userId: string, eventId: string): Promise<Parameters<typeof mapBudgetCategoryRecord>[0][]>
  seedDefaultCategories(userId: string, eventId: string): Promise<Parameters<typeof mapBudgetCategoryRecord>[0][]>
  createCategory(userId: string, eventId: string, title: string): Promise<Parameters<typeof mapBudgetCategoryRecord>[0] | null>
  createItem(
    userId: string,
    eventId: string,
    input: ReturnType<typeof parseCreateItemInput>,
  ): Promise<Parameters<typeof mapBudgetItemRecord>[0] | null>
  updateItem(
    userId: string,
    eventId: string,
    itemId: string,
    input: ReturnType<typeof parseUpdateItemInput>,
  ): Promise<{ count: number }>
  findItem(userId: string, eventId: string, itemId: string): Promise<Parameters<typeof mapBudgetItemRecord>[0] | null>
}

function ensureAccess<T>(record: T | null) {
  if (!record) {
    throw new EventBudgetValidationError('Мероприятие или статья расходов не найдены')
  }
  return record
}

export async function listBudgetCategoriesForEvent(userId: string, eventId: string, deps: EventBudgetDeps) {
  if (!userId || !eventId) return []

  const categories = await deps.listCategories(userId, eventId)
  if (categories.length > 0) return categories.map(mapBudgetCategoryRecord)

  const seeded = await deps.seedDefaultCategories(userId, eventId)
  return seeded.map(mapBudgetCategoryRecord)
}

export async function createBudgetCategoryForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventBudgetDeps) {
  const input = parseCreateCategoryInput(rawInput)
  const category = await deps.createCategory(userId, eventId, input.title)
  return mapBudgetCategoryRecord(ensureAccess(category))
}

export async function createBudgetItemForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventBudgetDeps) {
  const input = parseCreateItemInput(rawInput)
  const item = await deps.createItem(userId, eventId, input)
  return mapBudgetItemRecord(ensureAccess(item))
}

export async function updateBudgetItemForEvent(
  userId: string,
  eventId: string,
  itemId: string,
  rawInput: unknown,
  deps: EventBudgetDeps,
) {
  const input = parseUpdateItemInput(rawInput)
  const current = ensureAccess(await deps.findItem(userId, eventId, itemId))

  const cost = input.cost ?? current.cost
  const paid = input.paid ?? current.paid

  if (paid > cost) {
    throw new EventBudgetValidationError('Оплачено не может превышать стоимость')
  }

  const result = await deps.updateItem(userId, eventId, itemId, input)
  if (result.count < 1) ensureAccess(null)

  return mapBudgetItemRecord(ensureAccess(await deps.findItem(userId, eventId, itemId)))
}

export function isEventBudgetError(error: unknown): error is EventBudgetValidationError {
  return error instanceof EventBudgetValidationError
}
```

- [ ] **Step 5: Написать репозиторий**

```ts
// src/features/events/budget/server/eventBudget.repository.ts
import prisma from '@/lib/prisma'
import { DEFAULT_BUDGET_CATEGORIES } from '../eventBudget.data'
import type { CreateItemInput, UpdateItemInput } from './eventBudget.validation'

const categoryInclude = {
  items: {
    orderBy: {
      order: 'asc' as const,
    },
  },
}

export const eventBudgetRepository = {
  async listCategories(userId: string, eventId: string) {
    return prisma.eventBudgetCategory.findMany({
      where: { eventId, event: { userId } },
      include: categoryInclude,
      orderBy: { order: 'asc' },
    })
  },

  async seedDefaultCategories(userId: string, eventId: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return []

    await prisma.$transaction(
      DEFAULT_BUDGET_CATEGORIES.map((category) =>
        prisma.eventBudgetCategory.create({
          data: { eventId, title: category.title, order: category.order },
        }),
      ),
    )

    return this.listCategories(userId, eventId)
  },

  async createCategory(userId: string, eventId: string, title: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return null

    const order = await prisma.eventBudgetCategory.count({ where: { eventId, event: { userId } } })

    return prisma.eventBudgetCategory.create({
      data: { eventId, title, order },
      include: categoryInclude,
    })
  },

  async createItem(userId: string, eventId: string, input: CreateItemInput) {
    const category = await prisma.eventBudgetCategory.findFirst({
      where: { id: input.categoryId, eventId, event: { userId } },
      include: { _count: { select: { items: true } } },
    })

    if (!category) return null

    return prisma.eventBudgetItem.create({
      data: {
        categoryId: input.categoryId,
        title: input.title,
        cost: input.cost,
        paid: input.paid,
        currency: input.currency,
        order: category._count.items,
      },
    })
  },

  updateItem(userId: string, eventId: string, itemId: string, input: UpdateItemInput) {
    return prisma.eventBudgetItem.updateMany({
      where: { id: itemId, category: { eventId, event: { userId } } },
      data: input,
    })
  },

  findItem(userId: string, eventId: string, itemId: string) {
    return prisma.eventBudgetItem.findFirst({
      where: { id: itemId, category: { eventId, event: { userId } } },
    })
  },
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/features/events/budget/`
Expected: PASS — 3 файла, 34 теста

- [ ] **Step 7: Commit**

```bash
git add src/features/events/budget/server/
git commit -m "feat(web): add event budget service layer"
```

## Task 9: API-роуты бюджета

**Files:**
- Create: `src/app/api/events/[id]/budget/categories/route.ts`
- Create: `src/app/api/events/[id]/budget/items/route.ts`
- Create: `src/app/api/events/[id]/budget/items/[itemId]/route.ts`

**Interfaces:**
- Consumes: сервис и репозиторий из Task 8
- Produces: HTTP-контракт `{ categories }`, `{ category }`, `{ item }`, `{ error }`

- [ ] **Step 1: Написать роут категорий**

```ts
// src/app/api/events/[id]/budget/categories/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { eventBudgetRepository } from '@/features/events/budget/server/eventBudget.repository'
import {
  createBudgetCategoryForEvent,
  isEventBudgetError,
  listBudgetCategoriesForEvent,
} from '@/features/events/budget/server/eventBudget.service'
import { auth } from '@/lib/auth'

type BudgetRouteContext = {
  params: Promise<{ id: string }>
}

function toErrorResponse(error: unknown) {
  if (isEventBudgetError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать бюджет' }, { status: 500 })
}

export async function GET(_request: NextRequest, context: BudgetRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const categories = await listBudgetCategoriesForEvent(session.user.id, id, eventBudgetRepository)
    return NextResponse.json({ categories })
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: BudgetRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const category = await createBudgetCategoryForEvent(session.user.id, id, await request.json(), eventBudgetRepository)
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}
```

- [ ] **Step 2: Написать роут создания статьи**

Тот же каркас, `POST` вызывает `createBudgetItemForEvent`, отдаёт `{ item }` со статусом 201.

- [ ] **Step 3: Написать роут правки статьи**

Контекст `params: Promise<{ id: string; itemId: string }>`, `PATCH` вызывает `updateBudgetItemForEvent`, отдаёт `{ item }` со статусом 200.

- [ ] **Step 4: Проверить типы**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: без ошибок

- [ ] **Step 5: Commit**

```bash
git add src/app/api/events/
git commit -m "feat(web): add event budget api routes"
```

## Task 10: Экран бюджета

**Files:**
- Create: `src/features/events/budget/BudgetSummary.tsx`
- Create: `src/features/events/budget/BudgetCategoryRail.tsx`
- Create: `src/features/events/budget/BudgetItemRow.tsx`
- Create: `src/features/events/budget/BudgetItemModal.tsx`
- Create: `src/features/events/budget/BudgetCategoryModal.tsx`
- Create: `src/features/events/budget/EventBudgetPage.tsx`
- Create: `src/features/events/budget/EventBudgetPage.module.css`
- Create: `src/app/event/[id]/budget/page.tsx`

**Interfaces:**
- Consumes: `EventWorkspaceChrome` (Task 2), `summarizeBudget`/`selectCategoryItems`/`getItemDue` (Task 6), `formatMoney`/`formatAmount` (Task 4), сервис и репозиторий (Task 8)
- Produces: рабочий экран `/event/[id]/budget`

Макеты: `reference-image/Бюджет.png` (desktop), `Бюджет-1.png` (mobile), `Бюджет Редактирование.png` и `Добавить бюджет/категорию расходов.png` (модалки).

- [ ] **Step 1: `BudgetSummary.tsx`**

Три плитки — «Общий бюджет», «Оплачено», «К оплате». Значение внутри белой пилюли, текст через `formatMoney`. Принимает `BudgetSummaryTotals`.

- [ ] **Step 2: `BudgetCategoryRail.tsx`**

Принимает `categories`, `activeId`, `onSelect`. На десктопе — вертикальный список кнопок, первая «ОБЩИЙ» с `ALL_CATEGORIES_KEY`, активная тёмная. На мобильном тот же список отдаётся как `<select>` — переключение через CSS, разметка одна.

- [ ] **Step 3: `BudgetItemRow.tsx`**

Десктоп: `Статья | Стоимость + валюта | Оплачено + валюта | К оплате + валюта | карандаш`. Все три селектора валюты меняют одно поле `currency` статьи. «К оплате» — вычисляемое через `getItemDue`, только для чтения. Мобайл: строка «название + сумма + шеврон», раскрытая показывает «Оплачено: …», «К оплате: …» и круглую кнопку правки.

- [ ] **Step 4: `BudgetItemModal.tsx`**

Одна модалка на добавление и правку. Заголовок и метка первого поля зависят от режима: `Добавить статью расходов` + `Название`, либо `Редактировать расходы` + `Статья расходов`. Поля: название, общая стоимость, оплачено, к оплате (`readOnly`, пересчёт на лету), валюта (`<select>` из `CURRENCY_CODES`). Кнопка «Сохранить изменения». Ошибка выводится в `<p role="alert">`.

- [ ] **Step 5: `BudgetCategoryModal.tsx`**

Одно поле «Название категории» и кнопка сохранения — по образцу `ListModal` из `EventTasksPage.tsx:213`.

- [ ] **Step 6: `EventBudgetPage.tsx`**

`'use client'`. Состояние: `categories`, `activeCategoryId`, открытые модалки, редактируемая статья. Мутации через `fetch` на роуты из Task 9, ответ вливается в состояние. Оборачивается в `EventWorkspaceChrome` с `active="budget"`, хлебные крошки `Главная › Моя свадьба › Бюджет`.

- [ ] **Step 7: `EventBudgetPage.module.css`**

Стили по макету. Общий чром не дублировать — он в своём модуле.

- [ ] **Step 8: Серверный роут**

```tsx
// src/app/event/[id]/budget/page.tsx
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EventBudgetPage } from '@/features/events/budget/EventBudgetPage'
import { eventBudgetRepository } from '@/features/events/budget/server/eventBudget.repository'
import { listBudgetCategoriesForEvent } from '@/features/events/budget/server/eventBudget.service'
import { auth } from '@/lib/auth'

type EventBudgetRouteProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Бюджет | I GO WED',
}

export default async function EventBudgetRoute({ params }: EventBudgetRouteProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect(`/login?next=/event/${id}/budget`)
  }

  const categories = await listBudgetCategoriesForEvent(session.user.id, id, eventBudgetRepository)

  return <EventBudgetPage eventId={id} initialCategories={categories} summaryCurrency="BYN" />
}
```

- [ ] **Step 9: Полная проверка**

Run: `npm run lint && npm run build && npm run test`
Expected: всё зелёное

- [ ] **Step 10: Саморевью**

Сверить экран с `Бюджет.png` и `Бюджет-1.png`: порядок колонок, тексты кнопок, поведение «К оплате». Проверить, что вкладка «Бюджет» подсвечена, а `href="#"` для бюджета больше нигде нет. Найденное исправить и перепрогнать Step 9.

- [ ] **Step 11: Commit и PR**

```bash
git add -A
git commit -m "feat(web): add event budget page"
git push -u origin feature/event-budget
gh pr create --base client --title "feat(web): add event budget" --body "Экран бюджета мероприятия по макетам: категории, сводка, статьи расходов, модалки добавления и правки. Плюс модуль конвертации валют."
```

- [ ] **Step 12: Дождаться CI и влить**

Run: `gh pr checks --watch`, затем `gh pr merge --squash --delete-branch`.

---

# Ветка 3 — `feature/event-timing`

- [ ] **Ветка:** `git checkout client && git pull && git checkout -b feature/event-timing`

## Task 11: Prisma-модели тайминга

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Добавить связь в `Event`**

После `budgetCategories EventBudgetCategory[]` добавить `timelines EventTimeline[]`.

- [ ] **Step 2: Добавить модели**

```prisma
model EventTimeline {
  id        String   @id @default(cuid())
  eventId   String
  title     String
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  event   Event                @relation(fields: [eventId], references: [id], onDelete: Cascade)
  entries EventTimelineEntry[]

  @@index([eventId])
}

model EventTimelineEntry {
  id           String   @id @default(cuid())
  timelineId   String
  startTime    String
  endTime      String
  title        String
  location     String?
  participants String[] @default([])
  comment      String?  @db.Text
  order        Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  timeline EventTimeline @relation(fields: [timelineId], references: [id], onDelete: Cascade)

  @@index([timelineId])
}
```

- [ ] **Step 3: Сгенерировать клиент**

Run: `npm run db:generate`
Expected: `Generated Prisma Client`

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(api): add event timeline schema"
```

## Task 12: Типы, данные и чистая логика тайминга

**Files:**
- Create: `src/features/events/timing/eventTiming.types.ts`
- Create: `src/features/events/timing/eventTiming.data.ts`
- Create: `src/features/events/timing/eventTiming.format.ts`
- Test: `src/features/events/timing/eventTiming.format.test.ts`

**Interfaces:**
- Consumes: ничего
- Produces: `TimelineEntry`, `Timeline`, `PARTICIPANT_ROLES`, `DEFAULT_TIMELINE_TITLE`, `compareTimes(a, b): number`, `formatTimeRange(start, end): string`, `sortEntries(entries): TimelineEntry[]`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/events/timing/eventTiming.format.test.ts
import { describe, expect, it } from 'vitest'
import { compareTimes, formatTimeRange, sortEntries } from './eventTiming.format'
import type { TimelineEntry } from './eventTiming.types'

function entry(overrides: Partial<TimelineEntry> = {}): TimelineEntry {
  return {
    id: 'e1',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Подготовка невесты и жениха',
    location: 'По домам',
    participants: ['Невеста'],
    comment: null,
    order: 0,
    ...overrides,
  }
}

describe('compareTimes', () => {
  it('сравнивает по часам', () => {
    expect(compareTimes('09:00', '11:00')).toBeLessThan(0)
  })

  it('сравнивает по минутам при равных часах', () => {
    expect(compareTimes('12:30', '12:00')).toBeGreaterThan(0)
  })

  it('считает одинаковое время равным', () => {
    expect(compareTimes('14:00', '14:00')).toBe(0)
  })
})

describe('formatTimeRange', () => {
  it('склеивает начало и конец через дефис', () => {
    expect(formatTimeRange('09:00', '11:00')).toBe('09:00-11:00')
  })
})

describe('sortEntries', () => {
  it('сортирует по времени начала', () => {
    const sorted = sortEntries([entry({ id: 'b', startTime: '13:00' }), entry({ id: 'a', startTime: '09:00' })])
    expect(sorted.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('при равном времени сохраняет порядок по order', () => {
    const sorted = sortEntries([
      entry({ id: 'b', startTime: '09:00', order: 2 }),
      entry({ id: 'a', startTime: '09:00', order: 1 }),
    ])
    expect(sorted.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('не мутирует исходный массив', () => {
    const input = [entry({ id: 'b', startTime: '13:00' }), entry({ id: 'a', startTime: '09:00' })]
    sortEntries(input)
    expect(input[0].id).toBe('b')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/events/timing/`
Expected: FAIL — `Failed to resolve import "./eventTiming.format"`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/events/timing/eventTiming.types.ts
export type TimelineEntry = {
  id: string
  startTime: string
  endTime: string
  title: string
  location: string | null
  participants: string[]
  comment: string | null
  order: number
}

export type Timeline = {
  id: string
  title: string
  order: number
  entries: TimelineEntry[]
}
```

```ts
// src/features/events/timing/eventTiming.data.ts
export const DEFAULT_TIMELINE_TITLE = 'Общий тайминг'

export const PARTICIPANT_ROLES = [
  'Жених',
  'Невеста',
  'Ведущий',
  'Видеограф',
  'Визажист',
  'Декоратор',
  'Организатор',
  'Фотограф',
] as const

export const timingFieldLabels = {
  start: 'Начало',
  end: 'Окончание',
  title: 'Название события',
  location: 'Локация',
  participants: 'Участники',
  comment: 'Комментарий',
} as const
```

```ts
// src/features/events/timing/eventTiming.format.ts
import type { TimelineEntry } from './eventTiming.types'

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':')
  return Number(hours) * 60 + Number(minutes)
}

export function compareTimes(a: string, b: string): number {
  return toMinutes(a) - toMinutes(b)
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}-${endTime}`
}

export function sortEntries(entries: readonly TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => compareTimes(a.startTime, b.startTime) || a.order - b.order)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/events/timing/`
Expected: PASS — 7 тестов

- [ ] **Step 5: Commit**

```bash
git add src/features/events/timing/
git commit -m "feat(web): add event timing domain logic"
```

## Task 13: Валидация тайминга

**Files:**
- Create: `src/features/events/timing/server/eventTiming.validation.ts`
- Test: `src/features/events/timing/server/eventTiming.validation.test.ts`

**Interfaces:**
- Consumes: `PARTICIPANT_ROLES` из Task 12
- Produces: `EventTimingValidationError`, `parseTimeInput`, `parseCreateTimelineInput`, `parseCreateEntryInput`, `parseUpdateEntryInput`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/events/timing/server/eventTiming.validation.test.ts
import { describe, expect, it } from 'vitest'
import {
  EventTimingValidationError,
  parseCreateEntryInput,
  parseCreateTimelineInput,
  parseTimeInput,
  parseUpdateEntryInput,
} from './eventTiming.validation'

describe('parseTimeInput', () => {
  it('нормализует односимвольный час', () => {
    expect(parseTimeInput('9:05')).toBe('09:05')
  })

  it('принимает нормальное время', () => {
    expect(parseTimeInput('14:30')).toBe('14:30')
  })

  it('отклоняет час больше 23', () => {
    expect(() => parseTimeInput('24:00')).toThrow(EventTimingValidationError)
  })

  it('отклоняет минуты больше 59', () => {
    expect(() => parseTimeInput('12:60')).toThrow(EventTimingValidationError)
  })

  it('отклоняет мусор', () => {
    expect(() => parseTimeInput('вечером')).toThrow('Укажите время в формате ЧЧ:ММ')
  })
})

describe('parseCreateTimelineInput', () => {
  it('нормализует название', () => {
    expect(parseCreateTimelineInput({ title: '  Общий   тайминг ' })).toEqual({ title: 'Общий тайминг' })
  })

  it('отклоняет пустое название', () => {
    expect(() => parseCreateTimelineInput({ title: '' })).toThrow(EventTimingValidationError)
  })
})

describe('parseCreateEntryInput', () => {
  it('разбирает корректное событие', () => {
    expect(
      parseCreateEntryInput({
        timelineId: 't1',
        startTime: '9:00',
        endTime: '11:00',
        title: 'Подготовка',
        location: 'По домам',
        participants: ['Невеста', 'Фотограф'],
        comment: 'Не опаздывать',
      }),
    ).toEqual({
      timelineId: 't1',
      startTime: '09:00',
      endTime: '11:00',
      title: 'Подготовка',
      location: 'По домам',
      participants: ['Невеста', 'Фотограф'],
      comment: 'Не опаздывать',
    })
  })

  it('обнуляет необязательные поля', () => {
    const parsed = parseCreateEntryInput({ timelineId: 't1', startTime: '09:00', endTime: '10:00', title: 'Сбор' })

    expect(parsed.location).toBeNull()
    expect(parsed.comment).toBeNull()
    expect(parsed.participants).toEqual([])
  })

  it('требует тайминг', () => {
    expect(() => parseCreateEntryInput({ startTime: '09:00', endTime: '10:00', title: 'Сбор' })).toThrow('Выберите тайминг')
  })

  it('требует название', () => {
    expect(() => parseCreateEntryInput({ timelineId: 't1', startTime: '09:00', endTime: '10:00', title: ' ' })).toThrow(
      'Название события обязательно',
    )
  })

  it('отклоняет окончание раньше начала', () => {
    expect(() => parseCreateEntryInput({ timelineId: 't1', startTime: '12:00', endTime: '11:00', title: 'Сбор' })).toThrow(
      'Окончание не может быть раньше начала',
    )
  })

  it('допускает событие нулевой длины', () => {
    expect(parseCreateEntryInput({ timelineId: 't1', startTime: '12:00', endTime: '12:00', title: 'Тост' }).endTime).toBe('12:00')
  })

  it('отклоняет участника вне словаря ролей', () => {
    expect(() =>
      parseCreateEntryInput({ timelineId: 't1', startTime: '09:00', endTime: '10:00', title: 'Сбор', participants: ['Сосед'] }),
    ).toThrow(EventTimingValidationError)
  })

  it('убирает дубли участников', () => {
    const parsed = parseCreateEntryInput({
      timelineId: 't1',
      startTime: '09:00',
      endTime: '10:00',
      title: 'Сбор',
      participants: ['Невеста', 'Невеста'],
    })

    expect(parsed.participants).toEqual(['Невеста'])
  })
})

describe('parseUpdateEntryInput', () => {
  it('принимает частичное обновление', () => {
    expect(parseUpdateEntryInput({ title: 'Новое название' })).toEqual({ title: 'Новое название' })
  })

  it('нормализует время в патче', () => {
    expect(parseUpdateEntryInput({ startTime: '9:00' })).toEqual({ startTime: '09:00' })
  })

  it('позволяет очистить комментарий', () => {
    expect(parseUpdateEntryInput({ comment: '' })).toEqual({ comment: null })
  })

  it('отклоняет пустой патч', () => {
    expect(() => parseUpdateEntryInput({})).toThrow('Нет данных для обновления')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/events/timing/server/`
Expected: FAIL — `Failed to resolve import "./eventTiming.validation"`

- [ ] **Step 3: Write the implementation**

```ts
// src/features/events/timing/server/eventTiming.validation.ts
import { compareTimes } from '../eventTiming.format'
import { PARTICIPANT_ROLES } from '../eventTiming.data'

export class EventTimingValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'EventTimingValidationError'
  }
}

export type CreateTimelineInput = {
  title: string
}

export type CreateEntryInput = {
  timelineId: string
  startTime: string
  endTime: string
  title: string
  location: string | null
  participants: string[]
  comment: string | null
}

export type UpdateEntryInput = {
  startTime?: string
  endTime?: string
  title?: string
  location?: string | null
  participants?: string[]
  comment?: string | null
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : undefined
}

export function parseTimeInput(value: unknown): string {
  const raw = cleanString(value)
  const match = raw?.match(/^(\d{1,2}):(\d{2})$/)

  if (!match) {
    throw new EventTimingValidationError('Укажите время в формате ЧЧ:ММ')
  }

  const hours = Number(match[1])
  const minutes = Number(match[2])

  if (hours > 23 || minutes > 59) {
    throw new EventTimingValidationError('Укажите время в формате ЧЧ:ММ')
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function parseParticipants(value: unknown): string[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) {
    throw new EventTimingValidationError('Некорректный список участников')
  }

  const roles = new Set<string>()

  for (const item of value) {
    const role = cleanString(item)
    if (!role || !(PARTICIPANT_ROLES as readonly string[]).includes(role)) {
      throw new EventTimingValidationError('Выберите участников из списка')
    }
    roles.add(role)
  }

  return [...roles]
}

function parseOptionalText(value: unknown): string | null {
  return cleanString(value) ?? null
}

export function parseCreateTimelineInput(raw: unknown): CreateTimelineInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTimingValidationError('Некорректные данные тайминга')
  }

  const title = cleanString((raw as Record<string, unknown>).title)
  if (!title) {
    throw new EventTimingValidationError('Название тайминга обязательно')
  }

  return { title }
}

export function parseCreateEntryInput(raw: unknown): CreateEntryInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTimingValidationError('Некорректные данные события')
  }

  const data = raw as Record<string, unknown>
  const timelineId = cleanString(data.timelineId)
  const title = cleanString(data.title)

  if (!timelineId) {
    throw new EventTimingValidationError('Выберите тайминг')
  }

  if (!title) {
    throw new EventTimingValidationError('Название события обязательно')
  }

  const startTime = parseTimeInput(data.startTime)
  const endTime = parseTimeInput(data.endTime)

  if (compareTimes(endTime, startTime) < 0) {
    throw new EventTimingValidationError('Окончание не может быть раньше начала')
  }

  return {
    timelineId,
    startTime,
    endTime,
    title,
    location: parseOptionalText(data.location),
    participants: parseParticipants(data.participants),
    comment: parseOptionalText(data.comment),
  }
}

export function parseUpdateEntryInput(raw: unknown): UpdateEntryInput {
  if (!raw || typeof raw !== 'object') {
    throw new EventTimingValidationError('Некорректные данные события')
  }

  const data = raw as Record<string, unknown>
  const input: UpdateEntryInput = {}

  if ('startTime' in data) input.startTime = parseTimeInput(data.startTime)
  if ('endTime' in data) input.endTime = parseTimeInput(data.endTime)

  if ('title' in data) {
    const title = cleanString(data.title)
    if (!title) throw new EventTimingValidationError('Название события обязательно')
    input.title = title
  }

  if ('location' in data) input.location = parseOptionalText(data.location)
  if ('participants' in data) input.participants = parseParticipants(data.participants)
  if ('comment' in data) input.comment = parseOptionalText(data.comment)

  if (Object.keys(input).length === 0) {
    throw new EventTimingValidationError('Нет данных для обновления')
  }

  return input
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/events/timing/`
Expected: PASS — 2 файла, 26 тестов

- [ ] **Step 5: Commit**

```bash
git add src/features/events/timing/server/
git commit -m "feat(web): add event timing validation"
```

## Task 14: Маппер, репозиторий и сервис тайминга

**Files:**
- Create: `src/features/events/timing/server/eventTiming.mapper.ts`
- Create: `src/features/events/timing/server/eventTiming.repository.ts`
- Create: `src/features/events/timing/server/eventTiming.service.ts`
- Test: `src/features/events/timing/server/eventTiming.service.test.ts`

**Interfaces:**
- Consumes: парсеры Task 13, типы Task 12
- Produces: `mapTimelineEntryRecord`, `mapTimelineRecord`, `eventTimingRepository`, `listTimelinesForEvent`, `createTimelineForEvent`, `createTimelineEntryForEvent`, `updateTimelineEntryForEvent`, `isEventTimingError`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/events/timing/server/eventTiming.service.test.ts
import { describe, expect, it, vi } from 'vitest'
import {
  createTimelineEntryForEvent,
  isEventTimingError,
  listTimelinesForEvent,
  updateTimelineEntryForEvent,
} from './eventTiming.service'
import { EventTimingValidationError } from './eventTiming.validation'

function entryRecord(overrides = {}) {
  return {
    id: 'e1',
    startTime: '09:00',
    endTime: '11:00',
    title: 'Подготовка',
    location: 'По домам',
    participants: ['Невеста'],
    comment: null,
    order: 0,
    ...overrides,
  }
}

function timelineRecord(overrides = {}) {
  return { id: 't1', title: 'Общий тайминг', order: 0, entries: [entryRecord()], ...overrides }
}

function deps(overrides = {}) {
  return {
    listTimelines: vi.fn().mockResolvedValue([timelineRecord()]),
    seedDefaultTimeline: vi.fn().mockResolvedValue([timelineRecord()]),
    createTimeline: vi.fn().mockResolvedValue(timelineRecord({ entries: [] })),
    createEntry: vi.fn().mockResolvedValue(entryRecord()),
    updateEntry: vi.fn().mockResolvedValue({ count: 1 }),
    findEntry: vi.fn().mockResolvedValue(entryRecord()),
    ...overrides,
  }
}

describe('listTimelinesForEvent', () => {
  it('отдаёт пустой список без пользователя', async () => {
    expect(await listTimelinesForEvent('', 'evt-1', deps())).toEqual([])
  })

  it('сеет тайминг по умолчанию при первом открытии', async () => {
    const dependencies = deps({ listTimelines: vi.fn().mockResolvedValue([]) })
    await listTimelinesForEvent('u1', 'evt-1', dependencies)

    expect(dependencies.seedDefaultTimeline).toHaveBeenCalledWith('u1', 'evt-1')
  })

  it('сортирует события по времени начала', async () => {
    const dependencies = deps({
      listTimelines: vi.fn().mockResolvedValue([
        timelineRecord({
          entries: [entryRecord({ id: 'b', startTime: '13:00' }), entryRecord({ id: 'a', startTime: '09:00' })],
        }),
      ]),
    })

    const timelines = await listTimelinesForEvent('u1', 'evt-1', dependencies)
    expect(timelines[0].entries.map((entry) => entry.id)).toEqual(['a', 'b'])
  })
})

describe('createTimelineEntryForEvent', () => {
  it('создаёт событие', async () => {
    const entry = await createTimelineEntryForEvent(
      'u1',
      'evt-1',
      { timelineId: 't1', startTime: '09:00', endTime: '11:00', title: 'Подготовка' },
      deps(),
    )

    expect(entry.id).toBe('e1')
  })

  it('падает на чужом тайминге', async () => {
    const dependencies = deps({ createEntry: vi.fn().mockResolvedValue(null) })

    await expect(
      createTimelineEntryForEvent('u1', 'evt-1', { timelineId: 't9', startTime: '09:00', endTime: '10:00', title: 'Сбор' }, dependencies),
    ).rejects.toThrow(EventTimingValidationError)
  })
})

describe('updateTimelineEntryForEvent', () => {
  it('обновляет событие', async () => {
    const dependencies = deps({ findEntry: vi.fn().mockResolvedValue(entryRecord({ title: 'Новое' })) })
    const entry = await updateTimelineEntryForEvent('u1', 'evt-1', 'e1', { title: 'Новое' }, dependencies)

    expect(entry.title).toBe('Новое')
  })

  it('отклоняет окончание раньше сохранённого начала', async () => {
    const dependencies = deps({ findEntry: vi.fn().mockResolvedValue(entryRecord({ startTime: '12:00' })) })

    await expect(updateTimelineEntryForEvent('u1', 'evt-1', 'e1', { endTime: '11:00' }, dependencies)).rejects.toThrow(
      'Окончание не может быть раньше начала',
    )
    expect(dependencies.updateEntry).not.toHaveBeenCalled()
  })

  it('падает на чужом событии', async () => {
    const dependencies = deps({ findEntry: vi.fn().mockResolvedValue(null) })

    await expect(updateTimelineEntryForEvent('u1', 'evt-1', 'e9', { title: 'Х' }, dependencies)).rejects.toThrow(EventTimingValidationError)
  })
})

describe('isEventTimingError', () => {
  it('узнаёт ошибку валидации тайминга', () => {
    expect(isEventTimingError(new EventTimingValidationError('нет'))).toBe(true)
  })

  it('не путает её с обычной ошибкой', () => {
    expect(isEventTimingError(new Error('нет'))).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/events/timing/server/eventTiming.service.test.ts`
Expected: FAIL — `Failed to resolve import "./eventTiming.service"`

- [ ] **Step 3: Написать маппер**

```ts
// src/features/events/timing/server/eventTiming.mapper.ts
import { sortEntries } from '../eventTiming.format'
import type { Timeline, TimelineEntry } from '../eventTiming.types'

type TimelineEntryRecord = {
  id: string
  startTime: string
  endTime: string
  title: string
  location: string | null
  participants: string[]
  comment: string | null
  order: number
}

type TimelineRecord = {
  id: string
  title: string
  order: number
  entries: TimelineEntryRecord[]
}

export function mapTimelineEntryRecord(entry: TimelineEntryRecord): TimelineEntry {
  return {
    id: entry.id,
    startTime: entry.startTime,
    endTime: entry.endTime,
    title: entry.title,
    location: entry.location,
    participants: entry.participants,
    comment: entry.comment,
    order: entry.order,
  }
}

export function mapTimelineRecord(timeline: TimelineRecord): Timeline {
  return {
    id: timeline.id,
    title: timeline.title,
    order: timeline.order,
    entries: sortEntries(timeline.entries.map(mapTimelineEntryRecord)),
  }
}
```

- [ ] **Step 4: Написать сервис**

```ts
// src/features/events/timing/server/eventTiming.service.ts
import { compareTimes } from '../eventTiming.format'
import { mapTimelineEntryRecord, mapTimelineRecord } from './eventTiming.mapper'
import {
  EventTimingValidationError,
  parseCreateEntryInput,
  parseCreateTimelineInput,
  parseUpdateEntryInput,
} from './eventTiming.validation'

type EventTimingDeps = {
  listTimelines(userId: string, eventId: string): Promise<Parameters<typeof mapTimelineRecord>[0][]>
  seedDefaultTimeline(userId: string, eventId: string): Promise<Parameters<typeof mapTimelineRecord>[0][]>
  createTimeline(userId: string, eventId: string, title: string): Promise<Parameters<typeof mapTimelineRecord>[0] | null>
  createEntry(
    userId: string,
    eventId: string,
    input: ReturnType<typeof parseCreateEntryInput>,
  ): Promise<Parameters<typeof mapTimelineEntryRecord>[0] | null>
  updateEntry(
    userId: string,
    eventId: string,
    entryId: string,
    input: ReturnType<typeof parseUpdateEntryInput>,
  ): Promise<{ count: number }>
  findEntry(userId: string, eventId: string, entryId: string): Promise<Parameters<typeof mapTimelineEntryRecord>[0] | null>
}

function ensureAccess<T>(record: T | null) {
  if (!record) {
    throw new EventTimingValidationError('Мероприятие или событие не найдены')
  }
  return record
}

export async function listTimelinesForEvent(userId: string, eventId: string, deps: EventTimingDeps) {
  if (!userId || !eventId) return []

  const timelines = await deps.listTimelines(userId, eventId)
  if (timelines.length > 0) return timelines.map(mapTimelineRecord)

  const seeded = await deps.seedDefaultTimeline(userId, eventId)
  return seeded.map(mapTimelineRecord)
}

export async function createTimelineForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventTimingDeps) {
  const input = parseCreateTimelineInput(rawInput)
  const timeline = await deps.createTimeline(userId, eventId, input.title)
  return mapTimelineRecord(ensureAccess(timeline))
}

export async function createTimelineEntryForEvent(userId: string, eventId: string, rawInput: unknown, deps: EventTimingDeps) {
  const input = parseCreateEntryInput(rawInput)
  const entry = await deps.createEntry(userId, eventId, input)
  return mapTimelineEntryRecord(ensureAccess(entry))
}

export async function updateTimelineEntryForEvent(
  userId: string,
  eventId: string,
  entryId: string,
  rawInput: unknown,
  deps: EventTimingDeps,
) {
  const input = parseUpdateEntryInput(rawInput)
  const current = ensureAccess(await deps.findEntry(userId, eventId, entryId))

  const startTime = input.startTime ?? current.startTime
  const endTime = input.endTime ?? current.endTime

  if (compareTimes(endTime, startTime) < 0) {
    throw new EventTimingValidationError('Окончание не может быть раньше начала')
  }

  const result = await deps.updateEntry(userId, eventId, entryId, input)
  if (result.count < 1) ensureAccess(null)

  return mapTimelineEntryRecord(ensureAccess(await deps.findEntry(userId, eventId, entryId)))
}

export function isEventTimingError(error: unknown): error is EventTimingValidationError {
  return error instanceof EventTimingValidationError
}
```

- [ ] **Step 5: Написать репозиторий**

```ts
// src/features/events/timing/server/eventTiming.repository.ts
import prisma from '@/lib/prisma'
import { DEFAULT_TIMELINE_TITLE } from '../eventTiming.data'
import type { CreateEntryInput, UpdateEntryInput } from './eventTiming.validation'

const timelineInclude = {
  entries: {
    orderBy: {
      order: 'asc' as const,
    },
  },
}

export const eventTimingRepository = {
  async listTimelines(userId: string, eventId: string) {
    return prisma.eventTimeline.findMany({
      where: { eventId, event: { userId } },
      include: timelineInclude,
      orderBy: { order: 'asc' },
    })
  },

  async seedDefaultTimeline(userId: string, eventId: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return []

    await prisma.eventTimeline.create({
      data: { eventId, title: DEFAULT_TIMELINE_TITLE, order: 0 },
    })

    return this.listTimelines(userId, eventId)
  },

  async createTimeline(userId: string, eventId: string, title: string) {
    const event = await prisma.event.findFirst({ where: { id: eventId, userId }, select: { id: true } })
    if (!event) return null

    const order = await prisma.eventTimeline.count({ where: { eventId, event: { userId } } })

    return prisma.eventTimeline.create({
      data: { eventId, title, order },
      include: timelineInclude,
    })
  },

  async createEntry(userId: string, eventId: string, input: CreateEntryInput) {
    const timeline = await prisma.eventTimeline.findFirst({
      where: { id: input.timelineId, eventId, event: { userId } },
      include: { _count: { select: { entries: true } } },
    })

    if (!timeline) return null

    return prisma.eventTimelineEntry.create({
      data: {
        timelineId: input.timelineId,
        startTime: input.startTime,
        endTime: input.endTime,
        title: input.title,
        location: input.location,
        participants: input.participants,
        comment: input.comment,
        order: timeline._count.entries,
      },
    })
  },

  updateEntry(userId: string, eventId: string, entryId: string, input: UpdateEntryInput) {
    return prisma.eventTimelineEntry.updateMany({
      where: { id: entryId, timeline: { eventId, event: { userId } } },
      data: input,
    })
  },

  findEntry(userId: string, eventId: string, entryId: string) {
    return prisma.eventTimelineEntry.findFirst({
      where: { id: entryId, timeline: { eventId, event: { userId } } },
    })
  },
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/features/events/timing/`
Expected: PASS — 3 файла, 36 тестов

- [ ] **Step 7: Commit**

```bash
git add src/features/events/timing/server/
git commit -m "feat(web): add event timing service layer"
```

## Task 15: API-роуты тайминга

**Files:**
- Create: `src/app/api/events/[id]/timing/timelines/route.ts`
- Create: `src/app/api/events/[id]/timing/entries/route.ts`
- Create: `src/app/api/events/[id]/timing/entries/[entryId]/route.ts`

- [ ] **Step 1: Написать три роута**

Каркас один в один с Task 9: `auth()`, 401 без сессии, делегирование в сервис, `toErrorResponse` с `isEventTimingError` и общим сообщением «Не удалось обработать тайминг». Контракты: `{ timelines }`, `{ timeline }` (201), `{ entry }` (201 на создание, 200 на правку).

- [ ] **Step 2: Проверить типы**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: без ошибок

- [ ] **Step 3: Commit**

```bash
git add src/app/api/events/
git commit -m "feat(web): add event timing api routes"
```

## Task 16: Экран тайминга

**Files:**
- Create: `src/features/events/timing/ParticipantChips.tsx`
- Create: `src/features/events/timing/TimingToolbar.tsx`
- Create: `src/features/events/timing/TimingEntryRow.tsx`
- Create: `src/features/events/timing/TimingEntryModal.tsx`
- Create: `src/features/events/timing/TimingCommentModal.tsx`
- Create: `src/features/events/timing/EventTimingPage.tsx`
- Create: `src/features/events/timing/EventTimingPage.module.css`
- Create: `src/app/event/[id]/timing/page.tsx`

Макеты: `reference-image/Тайминг.png` (desktop), `Тайминг-1.png` (mobile), `Тайминг Редактирование.png` и `Комментарий.png` (модалки).

- [ ] **Step 1: `ParticipantChips.tsx`**

Принимает `participants`, `onRemove`, `onAdd`. Каждый чип — метка и кнопка `⊗` с `aria-label={`Убрать участника ${role}`}`. Рядом кнопка «Добавить +», открывающая `<select>` из `PARTICIPANT_ROLES` без уже выбранных.

- [ ] **Step 2: `TimingToolbar.tsx`**

Селектор тайминга, кнопка «Добавить тайминг +», тёмная круглая кнопка «Добавить событие ⊕». Формулировки берутся из десктопного макета: мобильные «Добавить список» и «Добавить гостя» — ошибки макета, зафиксированные в спеке.

- [ ] **Step 3: `TimingEntryRow.tsx`**

Десктоп: `Время (два поля через дефис) | Событие | Локация | Участники | Комментарий`. Ссылка комментария — «Смотреть комментарий», если `comment` не пуст, иначе «Добавить комментарий». Мобайл: аккордеон «время + название», раскрытый показывает локацию, чипы, ссылку комментария и круглую кнопку правки.

- [ ] **Step 4: `TimingEntryModal.tsx`**

Поля по `Тайминг Редактирование.png`: Начало и Окончание в одной строке, Название события, Локация, Участники (селектор «Выбрать» + чипы), Комментарий (`<textarea>`), кнопка «Сохранить изменения».

- [ ] **Step 5: `TimingCommentModal.tsx`**

По `Комментарий.png`: заголовок «Комментарий», `<textarea>`, кнопка «Сохранить изменения», крестик закрытия.

- [ ] **Step 6: `EventTimingPage.tsx`**

`'use client'`. Состояние: `timelines`, `activeTimelineId`, открытые модалки, редактируемое событие. Мутации через `fetch` на роуты Task 15. Оборачивается в `EventWorkspaceChrome` с `active="timing"`, хлебные крошки `Главная › Моя свадьба › Тайминг`.

- [ ] **Step 7: `EventTimingPage.module.css`**

Стили по макету, без дублирования чрома.

- [ ] **Step 8: Серверный роут**

По образцу `src/app/event/[id]/budget/page.tsx` из Task 10: `auth()`, редирект на `/login?next=/event/${id}/timing`, `listTimelinesForEvent`, рендер `<EventTimingPage eventId={id} initialTimelines={timelines} />`. `metadata.title` — `'Тайминг | I GO WED'`.

- [ ] **Step 9: Полная проверка**

Run: `npm run lint && npm run build && npm run test`
Expected: всё зелёное

- [ ] **Step 10: Саморевью**

Сверить с макетами. Убедиться, что в навбаре не осталось `href="#"` для тайминга и бюджета, а рассадка по-прежнему заглушка. Найденное исправить и перепрогнать Step 9.

- [ ] **Step 11: Commit и PR**

```bash
git add -A
git commit -m "feat(web): add event timing page"
git push -u origin feature/event-timing
gh pr create --base client --title "feat(web): add event timing" --body "Экран тайминга мероприятия по макетам: несколько таймингов, события с временем, локацией, участниками и комментарием."
```

- [ ] **Step 12: Дождаться CI и влить**

Run: `gh pr checks --watch`, затем `gh pr merge --squash --delete-branch`.

---

## Итоговая проверка после трёх веток

- [ ] `git checkout client && git pull`
- [ ] `npm run db:generate && npm run lint && npm run build && npm run test`
- [ ] Вкладки «Тайминг» и «Бюджет» ведут на рабочие страницы из `tasks`, `guests` и друг из друга.
- [ ] «Рассадка» осталась единственной заглушкой.
- [ ] При поднятом Docker-стеке выполнить `npm run db:push` и открыть оба экрана вживую.
