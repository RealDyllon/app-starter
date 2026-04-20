# app-starter

Monorepo starter built around a TanStack Start web app.

## Structure

- `apps/web`: Main TanStack Start application (React 19 + Vite + Nitro)
- `packages/*`: Shared packages (currently empty)

## Tech stack (web app)

- TanStack Start + TanStack Router
- TanStack Query + SSR query integration
- oRPC API layer
- Better Auth
- Drizzle ORM + PostgreSQL
- TanStack DB (client-side collections)
- Biome (lint/format)
- Paraglide i18n

## Requirements

- Node.js 20+
- pnpm 10+
- PostgreSQL (for DB-backed features)

## Install

From repo root:

```bash
pnpm install
```

## Run in development

From repo root:

```bash
pnpm web:dev
```

Or directly in the app:

```bash
cd apps/web
pnpm dev
```

App runs on `http://localhost:3000`.

## Environment variables

Set these in `apps/web/.env.local`:

- `DATABASE_URL` (required for server DB access)
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `SERVER_URL` (optional)
- `VITE_APP_TITLE` (optional)
- `ANTHROPIC_API_KEY` (optional, for AI features)

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="replace-me"
SERVER_URL="http://localhost:3000"
VITE_APP_TITLE="app-starter"
ANTHROPIC_API_KEY=""
```

## Common commands

From `apps/web`:

```bash
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm lint
pnpm format
pnpm check
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
```

## Production build

Build from repo root:

```bash
pnpm --filter web build
```

Run Nitro output:

```bash
cd apps/web
node .output/server/index.mjs
```

## Notes

- `apps/web/src/routeTree.gen.ts` is generated; do not edit by hand.
- Root route shell lives at `apps/web/src/routes/__root.tsx` and must include `<Scripts />`.
- Keep `devtools()` as the first plugin in `apps/web/vite.config.ts`.
- Keep `tanstackStart()` before `viteReact()` in `apps/web/vite.config.ts`.

## More docs

- App-specific details: `apps/web/README.md`
- Team/project guidance: `AGENTS.md`
