# Agent Guide

## Agent Skills Setup

This repository uses project-local Agent Skills sourced from TanStack Intent and shipped TanStack package skills.

Exact CLI commands run:

- `pnpm dlx @tanstack/intent@latest install`
- `pnpm dlx @tanstack/intent@latest list`

Agent rule for architectural or library-specific work:

- Do not guess patterns that are covered by shipped TanStack skills.
- Load the matching skill by name first, then implement.
- TanStack Router skills are named `tanstack-router-core*`.
- TanStack Start skills are named `tanstack-start-core*`.
- TanStack DB skills are named `db-core*` and `meta-framework`.
- TanStack Devtools Vite skill is named `devtools-vite-plugin`.
- Do not maintain filesystem links to generated or installed skill files in this guide.

<!-- intent-skills:start -->
# Skill mappings are intentionally omitted. Use Agent Skills by name via
# discovery; do not add node_modules or local filesystem skill paths here.
<!-- intent-skills:end -->

## Durable Project Context

Project shape:

- Monorepo root: `app-starter`
- Main app: `apps/web` (TanStack Start + Vite + Nitro)

Chosen stack and integrations:

- Framework: React 19 + `@tanstack/react-start`
- Routing: `@tanstack/react-router` file-based routes in `apps/web/src/routes`
- Data fetching/cache: `@tanstack/react-query` + `@tanstack/react-router-ssr-query`
- RPC/API: oRPC (`apps/web/src/orpc/*`) plus route handlers in `apps/web/src/routes/api*`
- Auth: Better Auth (`apps/web/src/lib/auth.ts`)
- DB server layer: Drizzle ORM + PostgreSQL (`apps/web/src/db/*`)
- Client DB layer: TanStack DB collection module currently in `apps/web/src/tanstack-db/index.ts`
- Devtools: `@tanstack/react-devtools`, router/query panels, `@tanstack/devtools-vite`
- i18n: Paraglide (`apps/web/src/i18n/project.inlang`, `apps/web/src/i18n/paraglide`)

Environment variable requirements:

- Required for server DB path: `DATABASE_URL` (`apps/web/src/db/index.ts` uses non-null assertion).
- Better Auth local setup: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`.
- Optional app config: `SERVER_URL`, `VITE_APP_TITLE` (`apps/web/src/env.ts`).
- Optional AI key (kept in project docs): `ANTHROPIC_API_KEY`.

Deployment notes:

- Build command: `pnpm --filter web build`.
- Runtime output: Nitro server in `apps/web/.output`; start with `node .output/server/index.mjs`.
- `@tanstack/devtools-vite` strips devtools from production bundles by default.
- Keep `devtools()` as the first Vite plugin.
- Keep `tanstackStart()` before `viteReact()`.

Key architectural decisions:

- `apps/web/src/routeTree.gen.ts` is generated; do not hand-edit.
- Root document shell is in `apps/web/src/routes/__root.tsx` and must keep `<Scripts />`.
- API handlers are colocated in route files with `server.handlers`.
- Router creation lives in `apps/web/src/router.tsx` and is integrated with Query SSR utilities.

Known gotchas:

- TanStack Start is isomorphic by default; secrets/DB-only logic must not leak into client code.
- `createFileRoute(...)` path strings must match file route paths.
- TanStack DB is client-side only today; routes using it should disable SSR and preload collections.
- `apps/web/.env.local` has a formatting issue on `DATABASE_URL` (comment is on the same line).

Next steps:

- Decide whether `apps/web/src/tanstack-db/index.ts` replaces the removed `db-collections` module and update imports accordingly.
- Add a small developer note or script for regenerating `routeTree.gen.ts` after route refactors.
- If additional TanStack areas are adopted, install or update project-local Agent Skills and reference them by skill name.
