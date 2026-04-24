# E2E database setup

Playwright now treats the Drizzle schema as the single source of truth for local E2E startup.

## What happens on `pnpm test:e2e`

Before the app server starts, `scripts/prepare-test-db.ts` will:

1. connect to `DATABASE_URL`
2. drop and recreate the `public` schema
3. run `drizzle-kit push --force`

That gives each Playwright run a clean database with the current Drizzle schema, including the Better Auth tables exported from `src/server/db/schema.ts`.

## Safety guard

The reset script refuses to wipe a non-local database host unless
`PLAYWRIGHT_FORCE_DB_RESET=true` is set explicitly.

Accepted local hosts by default:

- `127.0.0.1`
- `localhost`
- `::1`
- `192.168.*`

## Existing server reuse

Playwright no longer reuses an already-running app server by default, because that skips database reset and makes starter-template runs stateful.

If you intentionally want to point Playwright at an already-running local server, set:

```bash
PLAYWRIGHT_REUSE_EXISTING_SERVER=true
```

You are then responsible for making sure the backing database state is the one you want.
