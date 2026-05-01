# web

TanStack Start application for the `app-starter` monorepo.

## Current application surface

- `/`: starter landing page with the mounted global shell
- `/about`: summary of the starter capabilities
- `/todos`: persistent sample feature backed by oRPC, Query, Drizzle, and PostgreSQL
- `/login`: email/password sign-in flow via Better Auth
- `/signup`: email/password sign-up flow via Better Auth
- `/api/$`: OpenAPI handler for the oRPC router
- `/api/rpc/$`: oRPC endpoint
- `/api/auth/$`: Better Auth endpoint

## Environment

Create `apps/web/.env.local` from `apps/web/.env.example`.

Required values:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`

Optional values:

- `BETTER_AUTH_URL` or `SERVER_URL` (one of them is required for Better Auth base URL resolution; `BETTER_AUTH_URL` takes precedence when both are set)
- `VITE_APP_TITLE`

## Commands

From `apps/web`:

```bash
pnpm dev
pnpm build
pnpm start
pnpm preview
pnpm test
pnpm test:e2e
pnpm check
pnpm lint
pnpm format
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
pnpm storybook
pnpm build-storybook
```

Storybook is present for component work, but the starter’s primary supported path is the application itself, not the Storybook demo set.

## Data and migrations

App data lives in `src/server/db` and currently includes the starter `todos` table.

Generate SQL migrations:

```bash
pnpm db:generate
```

Apply them:

```bash
pnpm db:migrate
```

Better Auth uses the same Postgres connection. Its tables are exported from `src/server/db/schema.ts` and managed through Drizzle migrations.

```bash
docker compose up -d postgres
pnpm db:migrate
```

Generate `BETTER_AUTH_SECRET` with a local secret generator such as `openssl rand -base64 32`.

## Testing

Unit and integration-style checks:

```bash
pnpm test
pnpm check
```

Playwright E2E checks:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

## Routing and generation

- File routes live in `src/routes`.
- `src/routeTree.gen.ts` is generated; do not edit it by hand.
- Running `pnpm dev` or `pnpm build` regenerates the route tree as needed.

## i18n

- Source locale messages live in `src/i18n/messages`.
- Paraglide project settings live in `src/i18n/project.inlang`.
- Generated Paraglide runtime files are emitted to `src/i18n/paraglide`.
- Running `pnpm dev` or `pnpm build` regenerates the Paraglide outputs.

## Architecture notes

- TanStack Start code is isomorphic by default. Keep DB access and auth server code on the server side only.
- The root document shell is in `src/routes/__root.tsx` and must keep `<Scripts />`.
- oRPC server code lives under `src/server/orpc`.
- DB code lives under `src/server/db`.
- Better Auth lives in `src/server/auth`.

## Docker

Build from the monorepo root:

```bash
docker build -f apps/web/Dockerfile -t app-starter-web .
```
