# I GO WED

Wedding marketplace with SEO frontend, separate API, PostgreSQL, and media storage.

## Stack

- Frontend: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- Backend: Fastify API in `apps/api`
- Database: PostgreSQL + Prisma
- Media: S3-compatible storage, MinIO for local development
- Tests: Vitest for API

## Branches

- `main` - stable integration branch
- `client` - frontend work
- `backend` - API, database, Docker, tests

Remote:

```bash
git remote -v
```

## Local Start

Install dependencies:

```bash
npm install
```

Start infrastructure:

```bash
docker compose up -d postgres minio
```

Apply database schema:

```bash
npm run db:push
```

Run frontend and API together:

```bash
npm run dev
```

Or run separately:

```bash
npm run dev:web
npm run dev:api
```

URLs:

- Web: http://localhost:3000
- API: http://localhost:4000/api/v1
- API health: http://localhost:4000/api/v1/health
- MinIO console: http://localhost:9001

## Checks

```bash
npm run test
npm run lint
npm run build:api
```

## Project Layout

```text
apps/
  api/
    src/
      config/
      modules/
        catalog/
        health/
    test/
docs/
  ARCHITECTURE.md
  RELEASE_PLAN.md
prisma/
src/
  app/
  components/
  data/
  lib/
```

## Development Direction

The first release should be built vertically:

1. API and database contracts.
2. Seeded data for the homepage.
3. Figma-accurate homepage sections as small reusable modules.
4. Desktop and mobile responsive implementation at the same time.
5. Tests and screenshot checks before expanding features.

See:

- [Architecture](docs/ARCHITECTURE.md)
- [First Release Plan](docs/RELEASE_PLAN.md)
- [Git Workflow](docs/GIT_WORKFLOW.md)
