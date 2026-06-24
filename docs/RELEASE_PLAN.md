# First Release Plan

## Принцип

За неделю нельзя надежно переписать все сразу. Делаем вертикальные куски: данные -> API -> секция фронта -> тест -> адаптив.

## День 1

- Разделить фронт и API.
- Поднять Docker: Postgres, MinIO, API.
- Создать первые API модули: health, catalog categories.
- Настроить тесты backend.
- Зафиксировать дизайн-секции главной.

## День 2

- Привести Prisma schema к реальному MVP: users, vendors, categories, services, media assets, blog posts.
- Seed для главной страницы.
- API для home feed: stats, picked vendors, service catalog, venues, blog preview.
- Тесты API на happy path и пустые состояния.

## День 3

- Начать новый модульный frontend для главной.
- Перенести header, category nav, hero, stats 1:1 по Figma.
- Подключить `next-intl`.
- Сделать desktop + mobile сразу для первых секций.

## День 4

- Перенести карточки и секции: benefits, picked, catalog, vendor CTA.
- Подключить данные из API через server components/fetch.
- Настроить `next/image` и размеры изображений.

## День 5

- Перенести venues, photo of day, blog, photographers, bridal looks, footer.
- Playwright screenshot checks desktop/mobile.
- Исправить расхождения по spacing, typography, image ratios.

## День 6

- Auth MVP: регистрация, логин, роли vendor/client/admin.
- Dashboard skeleton только для нужного релиза.
- Upload pipeline MVP для фото.

## День 7

- Regression pass.
- Lighthouse/SEO pass.
- Docker compose smoke test.
- Seed production-like data.
- Release branch and deploy checklist.

## Что не тащим в первый релиз

- Сложный чат.
- Сложная система бронирований.
- Полный админский интерфейс.
- Все страницы каталога в идеальном виде.

## Definition of Done

- `npm run test` проходит.
- API health отвечает.
- Главная совпадает с Figma на desktop и mobile.
- Нет файлов-комбайнов на 1000+ строк для новых секций.
- Все изображения идут через optimized pipeline или `next/image`.
