# Agent Guide

## Intent Setup

This repository is wired for TanStack Intent skill mappings.

Exact CLI commands run:

- `pnpm dlx @tanstack/intent@latest install`
- `pnpm dlx @tanstack/intent@latest list`

Agent rule for architectural or library-specific work:

- Do not guess patterns that are covered by shipped TanStack skills.
- Load the matching skill file first, then implement.

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "making architectural or library-specific changes in TanStack Start app structure and runtime boundaries"
    load: "apps/web/node_modules/@tanstack/start-client-core/skills/start-core/SKILL.md"
  - task: "editing API endpoints in file routes with createFileRoute server handlers"
    load: "apps/web/node_modules/@tanstack/start-client-core/skills/start-core/server-routes/SKILL.md"
  - task: "changing TanStack Router route structure, createFileRoute paths, navigation, and URL behavior"
    load: "apps/web/node_modules/@tanstack/router-core/skills/router-core/SKILL.md"
  - task: "working on TanStack DB collections, preload patterns, and React live-query usage"
    load: "apps/web/node_modules/@tanstack/db/skills/meta-framework/SKILL.md"
  - task: "changing devtools wiring or Vite devtools plugin behavior/order"
    load: "apps/web/node_modules/@tanstack/devtools-vite/skills/devtools-vite-plugin/SKILL.md"
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
- If additional TanStack areas are adopted (AI tooling, server functions middleware, deployment targets), extend the `intent-skills` block with the exact shipped skill path.
