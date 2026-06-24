# Git Workflow

## Branches

- `main` - stable integration branch.
- `backend` - base branch for API, database, Docker, storage, auth, and server tests.
- `client` - base branch for Next.js frontend, UI, i18n, SEO, and visual work.

## Feature Work

Create every feature from the matching base branch:

```bash
git switch backend
git pull origin backend
git switch -c feature/backend-home-api
```

```bash
git switch client
git pull origin client
git switch -c feature/home-hero
```

Use short branch prefixes:

- `feature/...` for new behavior.
- `fix/...` for bugs.
- `chore/...` for tooling and maintenance.
- `refactor/...` for internal restructuring.

## Pull Requests

Open PRs into the matching base branch:

- Backend feature PR -> `backend`
- Frontend feature PR -> `client`
- Stable release PR -> `main`

Before opening a PR:

```bash
npm run lint
npm run build:api
npm run test
```

The CI workflow runs the same required checks on pushes and pull requests.

## Release Flow

1. Merge backend changes into `backend` after CI passes.
2. Merge frontend changes into `client` after CI passes.
3. Open release PRs from `backend` and `client` into `main`.
4. Merge to `main` only when CI is green.

## Commit Style

Use concise commit messages:

```text
feat(api): add catalog categories endpoint
fix(web): correct homepage mobile spacing
chore(ci): add pull request checks
```

Do not add co-authors, generated-by footers, badges, or attribution blocks.
