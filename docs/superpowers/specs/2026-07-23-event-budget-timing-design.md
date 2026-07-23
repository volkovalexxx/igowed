# Бюджет и Тайминг мероприятия

Дата: 2026-07-23. Ветка-цель: `client`.

## Задача

Навбар воркспейса мероприятия содержит семь вкладок. Четыре работают, три ведут на `href="#"`.
Закрываем две из них — **Тайминг** и **Бюджет**, — на которые есть макеты в `reference-image/`.
Рассадка остаётся заглушкой: макета нет.

Источник истины по вёрстке:

| Экран | Файлы |
| --- | --- |
| Бюджет desktop | `Бюджет.png` |
| Бюджет mobile | `Бюджет-1.png` |
| Бюджет, модалка правки | `Бюджет Редактирование.png` |
| Бюджет, модалка добавления | `Добавить бюджет/категорию расходов.png` |
| Тайминг desktop | `Тайминг.png` |
| Тайминг mobile | `Тайминг-1.png` |
| Тайминг, модалка правки | `Тайминг Редактирование.png` |
| Модалка комментария | `Комментарий.png` |

## Принципы

Код дробим на мелкие однозадачные модули: типы, данные, чистые функции и компоненты — отдельными
импортируемыми файлами. Слой сервера везде делится на `repository → service → validation → mapper`,
как уже сделано в `src/features/events/tasks/server/` и `.../guests/server/`.

Тестами покрывается чистая логика: `*.format.ts`, `server/*.service.ts`, `server/*.validation.ts`,
`src/lib/currency/*`. Компонентных тестов в репозитории нет — новых не заводим.

## Шаг 0. Общий чром воркспейса

### Проблема

Блок `Header` + `Footer` в `EventTasksPage.tsx:13-93` и `EventGuestsPage.tsx:13-93` совпадает
дословно; расходится только активная вкладка. В CSS-модулях этих страниц продублированы
24 селектора: `.topbar`, `.topbarInner`, `.logo`, `.mainNav`, `.headerActions`, `.goldButton`,
`.currency`, `.iconButton`, `.badge`, `.user`, `.menuButton`, `.workspaceNav`, `.breadcrumbs`,
`.mobileContext`, `.page`, `.content`, `.footer`, `.footerInner`, `.footerLinks`, `.footerLogo`,
`.footerPill`, `.footerPills`, `.age`, `.copyright`.

Бюджет и Тайминг превратили бы это в четыре копии, а правку навбара — в правку четырёх файлов.

### Решение

```
src/features/events/workspace/
  workspaceTabs.ts                 определения вкладок
  workspaceTabs.test.ts
  EventWorkspaceHeader.tsx         топбар и основная навигация
  EventWorkspaceNav.tsx            вкладки воркспейса
  EventWorkspaceFooter.tsx
  EventWorkspaceChrome.tsx         композиция, принимает children
  EventWorkspaceChrome.module.css  перенесённые общие селекторы
```

`workspaceTabs.ts` — единственный источник вкладок:

| key | label | href |
| --- | --- | --- |
| `wedding` | Моя свадьба | `/event/{eventId}` |
| `favorites` | Избранное | `/dashboard/favorites` |
| `tasks` | Список задач | `/event/{eventId}/tasks` |
| `guests` | Список гостей | `/event/{eventId}/guests` |
| `seating` | Рассадка | `#` |
| `timing` | Тайминг | `/event/{eventId}/timing` |
| `budget` | Бюджет | `/event/{eventId}/budget` |

Интерфейс:

```tsx
<EventWorkspaceChrome eventId={eventId} active="budget" breadcrumbs={[...]}>
  {/* контент страницы */}
</EventWorkspaceChrome>
```

`EventWorkspaceChrome` — серверный компонент без состояния; страницы, которым нужен `'use client'`,
остаются клиентскими и рендерят чром как обёртку вокруг своего контента.

`workspaceTabs.test.ts` проверяет, что все href подставляют `eventId`, что ровно одна вкладка
помечается активной по `key`, и что `seating` намеренно ведёт на заглушку.

### Миграция существующих страниц

`EventTasksPage.tsx` и `EventGuestsPage.tsx` теряют локальные `Header`/`Footer` и перечисленные
селекторы из своих CSS-модулей. Метка «Список дел» в `createEvent.constants.ts:1` заменяется
импортом меток из `workspaceTabs.ts` — везде остаётся «Список задач».

Критерий готовности шага: `npm run test` зелёный, визуально `tasks` и `guests` не изменились.

## Шаг 1. Модуль валют

Нужен обоим экранам и переиспользуется дальше, поэтому живёт вне фич.

```
src/lib/currency/
  currency.types.ts     CurrencyCode, Money
  currency.rates.ts     таблица курсов + дата актуальности
  currency.convert.ts   convertMoney, sumMoney
  currency.format.ts    formatMoney
  currency.convert.test.ts
  currency.format.test.ts
```

```ts
export type CurrencyCode = 'BYN' | 'RUB' | 'USD' | 'EUR'
export type Money = { amount: number; currency: CurrencyCode }
```

`currency.rates.ts` хранит курсы к базовой валюте (`USD`) и экспортирует `RATES_UPDATED_AT`.
Таблица статическая. Это осознанный компромисс: живого источника курсов в проекте нет, а сводка
бюджета в макете сведена к одной валюте. Изоляция в одном файле — цена вопроса: когда появится
провайдер курсов, меняется только `currency.rates.ts`, потребители не трогаются.

`convertMoney(money, to)` округляет до целых единиц — дробных единиц в проекте нет нигде
(`Event.budgetMin/Max`, `Vendor.pricePerHour`, `VendorService.price` — все `Int`).

`sumMoney(list, to)` конвертирует каждый элемент и складывает.

`formatMoney({ amount: 15000, currency: 'BYN' })` → `15 000 BYN`, разделитель разрядов —
неразрывный пробел.

Тесты: конвертация в ту же валюту не меняет сумму; конвертация туда-обратно устойчива к округлению;
сумма пустого списка равна нулю в целевой валюте; формат разрядов.

## Шаг 2. Бюджет

### Модель данных

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

В `Event` добавляется `budgetCurrency String @default("BYN")` — валюта сводки — и связь
`budgetCategories EventBudgetCategory[]`.

Схема применяется через `npm run db:push`: каталога `prisma/migrations` в проекте нет.

### Решения по данным

**«К оплате» вычисляется, а не хранится.** `due = cost - paid`. В макете 5000 − 1000 = 4000,
данные сходятся. Хранение третьего числа позволило бы сохранить взаимно противоречивую строку.
В обеих модалках поле «К оплате» отображается и пересчитывается на лету, но недоступно для ввода.

**«ОБЩИЙ» — виртуальная категория.** В БД её нет: это все статьи мероприятия. Реальные категории
сидятся при первом открытии экрана — Невеста, Жених, Шоу-программа, Декор — тем же приёмом
`seedDefault*`, что уже применён в `eventTaskRepository.seedDefaultTaskGroups`.

**Валюта на статье, а не на строке таблицы.** В десктопном макете у каждого из трёх чисел строки
свой селектор валюты, но модалка правки предлагает одно поле «Валюта» на всю статью. Берём
трактовку модалки: селекторы в строке отражают и меняют одну и ту же валюту статьи.

**Сводка.** Каждая статья даёт три `Money` в своей валюте — `{ cost, currency }`,
`{ paid, currency }`, `{ cost - paid, currency }`. `summarizeBudget` складывает каждый из трёх
наборов через `sumMoney(..., event.budgetCurrency)` и возвращает три `Money` в валюте сводки.

### Структура

```
src/features/events/budget/
  eventBudget.types.ts
  eventBudget.data.ts          категории по умолчанию, метки
  eventBudget.format.ts        summarizeBudget, filterItemsByCategory, getItemDue
  eventBudget.format.test.ts
  EventBudgetPage.tsx          'use client', состояние и мутации
  BudgetCategoryRail.tsx       рельса категорий (desktop) и select (mobile)
  BudgetSummary.tsx            три плитки
  BudgetItemRow.tsx            строка таблицы / аккордеон
  BudgetItemModal.tsx          добавление и правка статьи
  BudgetCategoryModal.tsx      добавление категории
  EventBudgetPage.module.css
  server/
    eventBudget.repository.ts
    eventBudget.service.ts
    eventBudget.service.test.ts
    eventBudget.validation.ts
    eventBudget.validation.test.ts
    eventBudget.mapper.ts
```

`BudgetItemModal` обслуживает и добавление, и правку: макеты
`Добавить бюджет/категорию расходов.png` и `Бюджет Редактирование.png` отличаются только
заголовком и меткой первого поля («Название» против «Статья расходов»).

### API

| Метод и путь | Назначение |
| --- | --- |
| `GET /api/events/[id]/budget/categories` | список категорий со статьями |
| `POST /api/events/[id]/budget/categories` | создать категорию |
| `POST /api/events/[id]/budget/items` | создать статью |
| `PATCH /api/events/[id]/budget/items/[itemId]` | изменить статью |

Категории по умолчанию сидятся при первом успешном `GET`, если у мероприятия их ещё нет —
ровно как `listTaskGroupsForEvent` сеет группы задач. Серверный рендер страницы вызывает тот же
сервис напрямую, поэтому первое открытие экрана уже отдаёт засеянные категории.

Роут-хендлеры тонкие, по образцу `src/app/api/events/[id]/tasks/route.ts`: проверяют сессию через
`auth()`, отдают 401 без неё, делегируют в сервис, ошибку валидации превращают в ответ с её
статусом. Доступ к чужому мероприятию неотличим от несуществующего — репозиторий фильтрует по
`event.userId` во всех запросах, как в `eventTaskRepository`.

### Валидация

`parseCreateCategoryInput` — непустой `title`.

`parseCreateItemInput` — непустой `categoryId`, непустой `title`, `cost` и `paid` — целые
неотрицательные числа, `paid` не больше `cost`, `currency` из `CurrencyCode`.

`parseUpdateItemInput` — частичный набор тех же полей, пустой объект отклоняется.

Проверка `paid <= cost` при обновлении живёт в сервисе, а не в парсере: PATCH может прислать одно
`paid`, и решить корректность без сохранённого `cost` невозможно. Парсер отвечает за форму
данных, сервис — за инвариант поверх слитого состояния «статья из БД + патч».

Ошибки — через `EventBudgetValidationError` со `status = 400` и сообщением на русском, как
`EventTaskValidationError`.

### Экран

Десктоп: хлебные крошки, заголовок «Бюджет» с кнопкой «Добавить категорию +», слева рельса
категорий с активной «ОБЩИЙ», справа три плитки сводки и кнопка «Добавить статью расходов +»,
ниже таблица со столбцами «Статья расходов», «Стоимость», «Оплачено», «К оплате» и карандашом.

Мобайл: три плитки сводки в ряд, категория как `<select>`, «Добавить категорию +» и «Добавить
статью расходов +» отдельными строками, статьи — аккордеоны; раскрытая строка показывает
«Оплачено» и «К оплате» и круглую кнопку правки.

## Шаг 3. Тайминг

### Модель данных

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

В `Event` добавляется связь `timelines EventTimeline[]`.

### Решения по данным

**Время — строка `"HH:MM"`, не `DateTime`.** У события тайминга нет собственной даты: это часы
внутри дня свадьбы. Прецедент в схеме — `Event.eventTime String?`.

**Участники — `String[]`.** Это роли, а не ссылки на подрядчиков: в макете «Жених», «Невеста»
рядом с «Визажист», «Фотограф». Прецедент — `Event.atmospheres String[]`. Словарь ролей лежит в
`eventTiming.data.ts`: Жених, Невеста, Ведущий, Видеограф, Визажист, Декоратор, Организатор,
Фотограф.

**Таймингов может быть несколько.** Селектор «Общий тайминг» в макете и кнопка «Добавить тайминг»
означают набор именованных таймингов на мероприятие. Первый — «Общий тайминг» — сидится при первом
открытии экрана.

### Структура

```
src/features/events/timing/
  eventTiming.types.ts
  eventTiming.data.ts          словарь ролей, тайминг по умолчанию
  eventTiming.format.ts        formatTimeRange, sortEntries, parseTimeInput
  eventTiming.format.test.ts
  EventTimingPage.tsx          'use client'
  TimingToolbar.tsx            селектор тайминга и кнопки
  TimingEntryRow.tsx           строка таблицы / аккордеон
  TimingEntryModal.tsx         добавление и правка события
  TimingCommentModal.tsx       просмотр и правка комментария
  ParticipantChips.tsx         чипы участников с удалением
  EventTimingPage.module.css
  server/
    eventTiming.repository.ts
    eventTiming.service.ts
    eventTiming.service.test.ts
    eventTiming.validation.ts
    eventTiming.validation.test.ts
    eventTiming.mapper.ts
```

### API

| Метод и путь | Назначение |
| --- | --- |
| `GET /api/events/[id]/timing/timelines` | список таймингов с событиями |
| `POST /api/events/[id]/timing/timelines` | создать тайминг |
| `POST /api/events/[id]/timing/entries` | создать событие |
| `PATCH /api/events/[id]/timing/entries/[entryId]` | изменить событие |

Тайминг по умолчанию сеется при первом `GET` тем же приёмом, что и категории бюджета.

### Валидация

`parseTimeInput` принимает `"HH:MM"` и `"H:MM"`, нормализует к `"HH:MM"`, отклоняет часы больше 23
и минуты больше 59.

`parseCreateEntryInput` — непустой `timelineId`, непустой `title`, корректные `startTime` и
`endTime`, `endTime` не раньше `startTime`, `participants` — подмножество словаря ролей,
`location` и `comment` необязательны.

`parseUpdateEntryInput` — частичный набор, пустой объект отклоняется; сравнение времён выполняется
по итоговому состоянию события.

### Экран

Десктоп: заголовок «Тайминг», селектор тайминга, «Добавить тайминг +», «Добавить событие ⊕».
Таблица со столбцами «Время» (два поля времени через дефис), «Событие», «Локация», «Участники»
(чипы с крестиком и кнопка «Добавить +»), «Комментарий» (ссылка «Смотреть комментарий» либо
«Добавить комментарий»).

Мобайл: селектор тайминга и кнопки сверху, события — аккордеоны «время + название»; раскрытая
строка показывает локацию, чипы участников, «Добавить +», ссылку комментария и кнопку правки.

Строки сортируются по `startTime`, затем по `order`.

## Расхождения в макетах

| Где | В макете | Берём | Причина |
| --- | --- | --- | --- |
| Тайминг mobile | кнопка «Добавить гостя ⊕» | «Добавить событие» | копипаста с экрана гостей: на экране тайминга гостей нет |
| Тайминг mobile против desktop | «Добавить список» / «Добавить тайминг» | «Добавить тайминг» | десктопная формулировка точнее описывает сущность |
| `createEvent.constants.ts:1` | «Список дел» | «Список задач» | во всех остальных местах и в макетах — «Список задач» |
| Сводка бюджета | итоги в `$` при строках в `BYN` | итоги в `event.budgetCurrency` | статичный макет; конвертация делает число осмысленным |
| Рассадка | макета нет | `href="#"` | нечего реализовывать |

## Поставка

Три ветки от `client`, на каждой полный цикл: реализация, саморевью с исправлением найденного,
`npm run test`, PR в `client`, ожидание CI, мерж при зелёном.

1. `feature/event-workspace-chrome` — шаг 0.
2. `feature/event-budget` — шаги 1 и 2. Модуль валют едет вместе с бюджетом: он его первый
   потребитель, отдельная ветка ради четырёх файлов без потребителя смысла не имеет.
3. `feature/event-timing` — шаг 3.

Порядок обязателен: обе фичи опираются на чром из первой ветки.

## Что в объём не входит

- Рассадка — нет макета.
- Удаление статей расходов и событий тайминга. Ни в одном макете нет ни кнопки удаления, ни
  подтверждения — только карандаш правки. Эндпоинт без интерфейса был бы мёртвым кодом; когда
  появится макет, добавим `DELETE` вместе с ним.
- Живой источник курсов валют.
- Страница после мероприятия, Шорт-лист, экраны профиля подрядчика — отдельные задачи.
- Компонентные и Playwright-тесты — в проекте их нет, эта работа их не заводит.
