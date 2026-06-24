# I GO WED Architecture

## Цель

Собираем проект как масштабируемый marketplace, а не как одну большую Next.js страницу.
Фронт и сервер развязаны, но живут в одном репозитории, чтобы первую неделю двигаться быстро.

## Репозиторий и ветки

- `main` - стабильная интеграционная ветка.
- `backend` - API, БД, Docker, storage, auth, тесты.
- `client` - Next.js фронт, дизайн-система, страницы, i18n.

Локальные ветки уже созданы. Remote: `https://github.com/volkovalexxx/igowed.git`.

## Приложения

- Root Next.js app - SEO-фронт на Next.js App Router. Позже можно физически перенести в `apps/web`.
- `apps/api` - отдельный Fastify API.
- `prisma` - схема БД и seed-данные.

## Backend

API строится модульно:

- `src/config` - env и конфигурация.
- `src/modules/<feature>` - routes, service, types, data/repository.
- `test` - feature-тесты через `fastify.inject`.

Первый API namespace: `/api/v1`.

## Media

Фото нельзя хранить в приложении. Для разработки используется MinIO, в production можно заменить на S3-compatible storage.

Базовый pipeline:

1. Загрузка оригинала в private/original bucket path.
2. Генерация responsive-вариантов через Sharp: `320`, `640`, `960`, `1280`, `1920`.
3. WebP/AVIF для сайта, оригинал хранится отдельно.
4. В БД храним asset metadata: размеры, blur placeholder, owner, variants.
5. На фронте используем `next/image` и CDN/public URL.

## Frontend

Next.js оставляем именно ради SEO, SSR/ISR, image optimization и маршрутизации.

Дизайн из Figma переносится не одним файлом, а секциями:

- `home/hero`
- `home/stats`
- `home/service-benefits`
- `home/picked-for-you`
- `home/service-catalog`
- `home/vendor-cta`
- `home/venues`
- `home/photo-of-day`
- `home/blog-preview`
- `home/photographers`
- `home/bridal-looks`
- `layout/footer`

Каждая секция получает:

- `*.tsx` компонент,
- `*.types.ts` типы рядом,
- `*.data.ts` временные данные или API mapper,
- тест, если есть логика форматирования/маппинга.

## i18n

Рекомендуемое решение для Next: `next-intl`.

Чтобы не писать перевод в каждом компоненте вручную:

- компоненты получают уже готовые строки через props,
- страницы/секции делают `useTranslations('home.hero')`,
- повторяемые сущности из БД переводятся как content fields: `title`, `title_en`, `title_ru` или отдельная translation table,
- для CMS-контента позже нужен админский слой, а не хардкод JSON.

## Качество

- Backend: Vitest + Fastify inject.
- Frontend: component/unit tests для логики, Playwright screenshot checks для pixel-critical секций.
- API contracts: Zod схемы рядом с модулями.
- Lint не должен проверять `src/generated/prisma`.
